<script setup lang="ts">
import { computed } from 'vue'

const inlineLineBreak = '\uE000'

type EnrichedTextSegment = {
  id: string
  text: string
  kind: 'normal' | 'italic' | 'marked' | 'rule'
}

type EnrichedLine = {
  id: string
  segments: EnrichedTextSegment[]
  indentLevel: number
  lineIndexInParagraph: number
}

type EnrichedParagraphBlock = {
  id: string
  kind: 'paragraph'
  paragraphIndexInPage: number
  lines: EnrichedLine[]
}

type EnrichedRuleBlock = {
  id: string
  kind: 'rule'
}

type EnrichedColBreakBlock = {
  id: string
  kind: 'col-break'
}

type EnrichedBlock = EnrichedParagraphBlock | EnrichedRuleBlock | EnrichedColBreakBlock

type DropcapContent = {
  dropcap: string | null
  dropcapLines: EnrichedLine[]
  remainingContent: string
}

const props = withDefaults(defineProps<{
  content: string
  showParagraphIndexes?: boolean
}>(), {
  showParagraphIndexes: true,
})

function getIndentLevel(line: string) {
  const indentation = line.match(/^[\t ]*/)?.[0] ?? ''
  const tabCount = (indentation.match(/\t/g) ?? []).length
  const spaceCount = (indentation.match(/ /g) ?? []).length

  return Math.min(tabCount + Math.floor(spaceCount / 2), 8)
}

function preserveMultilineTaggedBlocks(text: string) {
  return text.replace(/<(i|m)>([\s\S]*?)<\/\1>/gi, (_, tagName: string, taggedText: string) => {
    return `<${tagName}>${taggedText.replace(/\n/g, inlineLineBreak)}</${tagName}>`
  })
}

function restoreInlineLineBreaks(text: string) {
  return text.replaceAll(inlineLineBreak, '\n')
}

function parseTextSegments(text: string, lineId: string) {
  const segments: EnrichedTextSegment[] = []
  const taggedTextPattern = /<(i|m)>(.*?)<\/\1>|<hr\s*\/?>/gi
  let currentIndex = 0
  let match: RegExpExecArray | null
  let segmentIndex = 0

  while ((match = taggedTextPattern.exec(text)) !== null) {
    const [fullMatch, tagName, taggedText] = match
    const matchIndex = match.index

    if (matchIndex > currentIndex) {
      segments.push({
        id: `${lineId}-segment-${segmentIndex}`,
        text: restoreInlineLineBreaks(text.slice(currentIndex, matchIndex)),
        kind: 'normal',
      })
      segmentIndex += 1
    }

    if (/^<hr/i.test(fullMatch)) {
      segments.push({
        id: `${lineId}-segment-${segmentIndex}`,
        text: '',
        kind: 'rule',
      })
    }
    else {
      segments.push({
        id: `${lineId}-segment-${segmentIndex}`,
        text: restoreInlineLineBreaks(taggedText),
        kind: tagName.toLowerCase() === 'm' ? 'marked' : 'italic',
      })
    }

    segmentIndex += 1
    currentIndex = matchIndex + fullMatch.length
  }

  if (currentIndex < text.length) {
    segments.push({
      id: `${lineId}-segment-${segmentIndex}`,
      text: restoreInlineLineBreaks(text.slice(currentIndex)),
      kind: 'normal',
    })
  }

  if (segments.length === 0) {
    segments.push({
      id: `${lineId}-segment-0`,
      text: restoreInlineLineBreaks(text),
      kind: 'normal',
    })
  }

  return segments
}

function createEnrichedLine(rawLine: string, lineId: string, lineIndexInParagraph: number): EnrichedLine {
  const trimmedStart = rawLine.trimStart()

  return {
    id: lineId,
    segments: parseTextSegments(trimmedStart, lineId),
    indentLevel: getIndentLevel(rawLine),
    lineIndexInParagraph,
  }
}

function splitDropcapContent(content: string): DropcapContent {
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalizedContent.split('\n')
  const dropcapRawLines: string[] = []
  const dropcapLineIndices = new Set<number>()

  for (let lineIndex = 0; lineIndex < lines.length && dropcapRawLines.length < 3; lineIndex += 1) {
    if (lines[lineIndex]?.trim().length === 0) {
      continue
    }

    dropcapRawLines.push(lines[lineIndex]!)
    dropcapLineIndices.add(lineIndex)
  }

  if (dropcapRawLines.length === 0) {
    return {
      dropcap: null,
      dropcapLines: [],
      remainingContent: normalizedContent,
    }
  }

  const firstLineText = dropcapRawLines[0]!.trimStart()
  const dropcap = firstLineText.charAt(0) || null
  const dropcapLines: EnrichedLine[] = []
  const firstLineRemainder = firstLineText.slice(1)

  if (firstLineRemainder.length > 0) {
    dropcapLines.push(createEnrichedLine(firstLineRemainder, 'dropcap-line-0', 0))
  }

  for (let lineIndex = 1; lineIndex < dropcapRawLines.length; lineIndex += 1) {
    dropcapLines.push(createEnrichedLine(
      dropcapRawLines[lineIndex]!,
      `dropcap-line-${lineIndex}`,
      lineIndex,
    ))
  }

  const remainingContent = lines
    .filter((_, lineIndex) => !dropcapLineIndices.has(lineIndex))
    .join('\n')

  return {
    dropcap,
    dropcapLines,
    remainingContent,
  }
}

function parseBlocks(content: string): EnrichedBlock[] {
  const normalizedContent = preserveMultilineTaggedBlocks(
    content.replace(/\r\n/g, '\n').replace(/\r/g, '\n'),
  )
  const textLines = normalizedContent.split('\n')
  const parsedBlocks: EnrichedBlock[] = []
  let currentLines: EnrichedLine[] = []
  let paragraphCount = 0
  let ruleCount = 0
  let colBreakCount = 0

  function closeParagraph() {
    if (currentLines.length === 0) {
      return
    }

    parsedBlocks.push({
      id: `paragraph-${paragraphCount}`,
      kind: 'paragraph',
      paragraphIndexInPage: paragraphCount,
      lines: currentLines,
    })

    paragraphCount += 1
    currentLines = []
  }

  textLines.forEach((line) => {
    const trimmedLine = line.trim()

    if (trimmedLine.length === 0) {
      closeParagraph()
      return
    }

    if (/^<hr\s*\/?>$/i.test(trimmedLine)) {
      closeParagraph()
      parsedBlocks.push({
        id: `rule-${ruleCount}`,
        kind: 'rule',
      })
      ruleCount += 1
      return
    }

    if (/^<col\s*\/?>$/i.test(trimmedLine)) {
      closeParagraph()
      parsedBlocks.push({
        id: `col-break-${colBreakCount}`,
        kind: 'col-break',
      })
      colBreakCount += 1
      return
    }

    currentLines.push(createEnrichedLine(
      line,
      `paragraph-${paragraphCount}-line-${currentLines.length}`,
      currentLines.length,
    ))
  })

  closeParagraph()

  return parsedBlocks
}

const dropcapContent = computed(() => splitDropcapContent(props.content))

const blocks = computed(() => parseBlocks(dropcapContent.value.remainingContent))

const columns = computed<EnrichedBlock[][]>(() => {
  const cols: EnrichedBlock[][] = [[]]

  for (const block of blocks.value) {
    if (block.kind === 'col-break') {
      cols.push([])
      continue
    }

    cols[cols.length - 1]!.push(block)
  }

  return cols
})
</script>

<template>
  <article
    class="enriched-text"
    :class="{ 'enriched-text--no-indexes': !showParagraphIndexes }"
    aria-label="Texte enrichi"
    :style="{ '--col-count': columns.length }"
  >
    <div
      v-if="dropcapContent.dropcap"
      class="enriched-text__dropcap-row"
    >
      <div
        class="enriched-text__dropcap-cell"
        aria-hidden="true"
      >
        {{ dropcapContent.dropcap }}
      </div>

      <div class="enriched-text__dropcap-lines">
        <p
          v-for="line in dropcapContent.dropcapLines"
          :key="line.id"
          class="enriched-text__line"
          :data-line-index="line.lineIndexInParagraph"
          :style="{ '--indent-level': line.indentLevel }"
        >
          <template
            v-for="segment in line.segments"
            :key="segment.id"
          >
            <span
              v-if="segment.kind === 'rule'"
              class="enriched-text__rule"
              role="separator"
            />
            <em
              v-else-if="segment.kind === 'italic'"
              class="enriched-text__italic"
            >{{ segment.text }}</em>
            <span
              v-else-if="segment.kind === 'marked'"
              class="enriched-text__marked"
            >{{ segment.text }}</span>
            <template v-else>{{ segment.text }}</template>
          </template>
        </p>
      </div>
    </div>

    <div class="enriched-text__columns">
      <div
        v-for="(column, columnIndex) in columns"
        :key="`column-${columnIndex}`"
        class="enriched-text__column"
      >
        <template
          v-for="block in column"
          :key="block.id"
        >
          <section
            v-if="block.kind === 'paragraph'"
            class="enriched-text__paragraph"
            :data-paragraph-index="block.paragraphIndexInPage"
          >
            <span
              v-if="showParagraphIndexes"
              class="enriched-text__paragraph-index"
              aria-hidden="true"
            >
              {{ String(block.paragraphIndexInPage + 1).padStart(2, '0') }}
            </span>

            <p class="enriched-text__lines">
              <span
                v-for="line in block.lines"
                :key="line.id"
                class="enriched-text__line"
                :data-line-index="line.lineIndexInParagraph"
                :style="{ '--indent-level': line.indentLevel }"
              >
                <template
                  v-for="segment in line.segments"
                  :key="segment.id"
                >
                  <span
                    v-if="segment.kind === 'rule'"
                    class="enriched-text__rule"
                    role="separator"
                  />
                  <em
                    v-else-if="segment.kind === 'italic'"
                    class="enriched-text__italic"
                  >{{ segment.text }}</em>
                  <span
                    v-else-if="segment.kind === 'marked'"
                    class="enriched-text__marked"
                  >{{ segment.text }}</span>
                  <template v-else>{{ segment.text }}</template>
                </template>
              </span>
            </p>
          </section>

          <span
            v-else
            class="enriched-text__block-rule"
            role="separator"
          />
        </template>
      </div>
    </div>
  </article>
</template>

<style scoped>
.enriched-text {
  position: relative;
  width: max-content;
  max-width: 100%;
  color: var(--color-enrichment-text);
  font-family: var(--font-enrichment-body);
  font-size: var(--text-enrichment-body);
  line-height: var(--leading-enrichment-body);
}

.enriched-text__dropcap-row {
  display: flex;
  align-items: flex-start;
  gap: 0.35em;
  margin-bottom: var(--spacing-enrichment-paragraph-gap);
}

.enriched-text__dropcap-cell {
  flex-shrink: 0;
  color: var(--color-enrichment-text);
  font-family: var(--font-book-dropcap);
  font-size: calc(var(--text-book-dropcap-lines) * var(--leading-book-body) * 1em);
  line-height: 1;
  min-height: calc(var(--text-book-dropcap-lines) * var(--leading-book-body) * 1em);
}

.enriched-text__dropcap-lines {
  flex: 1;
  min-width: 0;
}

.enriched-text__columns {
  display: flex;
  gap: var(--spacing-enrichment-column-gap);
  width: 100%;
}

.enriched-text__column {
  display: grid;
  flex: 1 1 var(--spacing-enrichment-column-min-width);
  gap: var(--spacing-enrichment-paragraph-gap);
  min-width: var(--spacing-enrichment-column-min-width);
}

.enriched-text__paragraph {
  display: grid;
  grid-template-columns: var(--spacing-enrichment-index-column) minmax(0, 1fr);
  gap: var(--spacing-enrichment-column-gap);
}

.enriched-text--no-indexes .enriched-text__paragraph {
  grid-template-columns: minmax(0, 1fr);
}

.enriched-text__paragraph-index {
  align-self: start;
  color: var(--color-enrichment-accent);
  font-family: var(--font-enrichment-meta);
  font-size: var(--text-enrichment-meta);
  letter-spacing: var(--tracking-enrichment-meta);
  opacity: var(--opacity-enrichment-meta);
}

.enriched-text__lines {
  display: grid;
  gap: var(--spacing-enrichment-line-gap);
  margin: 0;
}

.enriched-text__line {
  display: block;
  margin-left: calc(var(--indent-level) * var(--spacing-enrichment-indent-step));
  white-space: nowrap;
}

.enriched-text__italic {
  font-style: italic;
  white-space: pre-line;
}

.enriched-text__marked {
  display: block;
  width: fit-content;
  max-width: 100%;
  margin-left: auto;
  padding: 0.3rem 0.9rem 0.3rem calc(0.9rem + 15px);
  border-radius: var(--radius-sm);
  background-color: var(--color-book-marked-background);
  color: var(--color-book-marked-text);
  font-family: "Libertinus Mono", monospace;
  font-size: 0.75em;
  text-align: right;
  white-space: pre-line;
}

.enriched-text__rule,
.enriched-text__block-rule {
  display: block;
  width: 100%;
  height: 0.7pt;
  margin: var(--spacing-enrichment-paragraph-gap) 0;
  background: var(--color-enrichment-rule);
  border: 0;
}
</style>
