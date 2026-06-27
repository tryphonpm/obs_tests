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

type EnrichedEspaceBlock = {
  id: string
  kind: 'espace'
}

type EnrichedImageBlock = {
  id: string
  kind: 'image'
  src: string
}

type EnrichedBlock = EnrichedParagraphBlock | EnrichedRuleBlock | EnrichedColBreakBlock | EnrichedEspaceBlock | EnrichedImageBlock

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

function getExtraIndentLevel(rawLine: string, baseIndentLevel: number) {
  return Math.max(0, getIndentLevel(rawLine) - baseIndentLevel)
}

function getLineDisplayText(rawLine: string) {
  return rawLine.trimStart()
}

function preserveMultilineTaggedBlocks(text: string) {
  return text.replace(/<(i|m)>([\s\S]*?)<\/\1>/gi, (_, tagName: string, taggedText: string) => {
    return `<${tagName}>${taggedText.replace(/\n/g, inlineLineBreak)}</${tagName}>`
  })
}

function restoreInlineLineBreaks(text: string) {
  return text.replaceAll(inlineLineBreak, '\n')
}

function normalizeImageSrc(filename: string) {
  const trimmed = filename.trim()

  if (!/^[A-Za-z0-9._-]+$/.test(trimmed)) {
    return null
  }

  return trimmed
}

function resolveImageUrl(filename: string) {
  const src = normalizeImageSrc(filename)

  if (!src) {
    return null
  }

  return `/images/${encodeURIComponent(src)}`
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
  let espaceCount = 0
  let imageCount = 0

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

    if (/^<espace\s*\/?>$/i.test(trimmedLine)) {
      closeParagraph()
      parsedBlocks.push({
        id: `espace-${espaceCount}`,
        kind: 'espace',
      })
      espaceCount += 1
      return
    }

    const imageMatch = trimmedLine.match(/^<img>([\s\S]*?)<\/img>$/i)
    const imageSrc = imageMatch?.[1] ? normalizeImageSrc(imageMatch[1]) : null

    if (imageMatch && imageSrc) {
      closeParagraph()
      parsedBlocks.push({
        id: `image-${imageCount}`,
        kind: 'image',
        src: imageSrc,
      })
      imageCount += 1
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

function extractDropcapFromBlocks(blocks: EnrichedBlock[]): {
  letter: string | null
  blocks: EnrichedBlock[]
} {
  for (let blockIndex = 0; blockIndex < blocks.length; blockIndex += 1) {
    const block = blocks[blockIndex]!

    if (block.kind !== 'paragraph') {
      continue
    }

    for (let lineIndex = 0; lineIndex < block.lines.length; lineIndex += 1) {
      const line = block.lines[lineIndex]!

      for (let segmentIndex = 0; segmentIndex < line.segments.length; segmentIndex += 1) {
        const segment = line.segments[segmentIndex]!

        if (segment.kind === 'rule' || segment.text.length === 0) {
          continue
        }

        const letter = segment.text.charAt(0)

        return {
          letter,
          blocks: blocks.map((currentBlock, currentBlockIndex) => {
            if (currentBlock.kind !== 'paragraph' || currentBlockIndex !== blockIndex) {
              return currentBlock
            }

            return {
              ...currentBlock,
              lines: currentBlock.lines.map((currentLine, currentLineIndex) => {
                if (currentLineIndex !== lineIndex) {
                  return currentLine
                }

                return {
                  ...currentLine,
                  segments: currentLine.segments.map((currentSegment, currentSegmentIndex) => {
                    if (currentSegmentIndex !== segmentIndex) {
                      return currentSegment
                    }

                    return {
                      ...currentSegment,
                      text: currentSegment.text.slice(1),
                    }
                  }),
                }
              }),
            }
          }),
        }
      }
    }
  }

  return { letter: null, blocks }
}

const parsedContent = computed(() => extractDropcapFromBlocks(parseBlocks(props.content)))

const dropcap = computed(() => parsedContent.value.letter)

const blocks = computed(() => parsedContent.value.blocks)

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

            <div class="enriched-text__lines">
              <div
                v-if="dropcap && columnIndex === 0 && block.paragraphIndexInPage === 0"
                class="enrichment-dropcap"
                aria-hidden="true"
              >
                {{ dropcap }}
              </div>

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
                  >
                    <template
                      v-for="(rawLine, lineIndex) in segment.text.split('\n')"
                      :key="`${segment.id}-line-${lineIndex}`"
                    >
                      <br v-if="lineIndex > 0">
                      <span
                        v-if="lineIndex > 0 && getExtraIndentLevel(rawLine, line.indentLevel) > 0"
                        class="enriched-text__inline-indent"
                        :style="{ '--extra-indent-level': getExtraIndentLevel(rawLine, line.indentLevel) }"
                      >{{ getLineDisplayText(rawLine) }}</span>
                      <template v-else>{{ getLineDisplayText(rawLine) }}</template>
                    </template>
                  </em>
                  <span
                    v-else-if="segment.kind === 'marked'"
                    class="enriched-text__marked"
                  >
                    <template
                      v-for="(rawLine, lineIndex) in segment.text.split('\n')"
                      :key="`${segment.id}-line-${lineIndex}`"
                    >
                      <br v-if="lineIndex > 0">
                      <span
                        v-if="lineIndex > 0 && getExtraIndentLevel(rawLine, line.indentLevel) > 0"
                        class="enriched-text__inline-indent"
                        :style="{ '--extra-indent-level': getExtraIndentLevel(rawLine, line.indentLevel) }"
                      >{{ getLineDisplayText(rawLine) }}</span>
                      <template v-else>{{ getLineDisplayText(rawLine) }}</template>
                    </template>
                  </span>
                  <template v-else>{{ segment.text }}</template>
                </template>
              </span>
            </div>
          </section>

          <div
            v-else-if="block.kind === 'espace'"
            class="enriched-text__espace"
            aria-hidden="true"
          />

          <figure
            v-else-if="block.kind === 'image'"
            class="enriched-text__image"
          >
            <img
              :src="resolveImageUrl(block.src) ?? undefined"
              :alt="block.src"
              class="enriched-text__image-el"
            >
          </figure>

          <span
            v-else-if="block.kind === 'rule'"
            class="enriched-text__block-rule"
            role="separator"
          />
        </template>
      </div>
    </div>

    <div class="enriched-text__footer">
      <NuxtLink
        to="/"
        class="enriched-text__nav-btn"
        aria-label="Retour à l'accueil"
      />
    </div>
  </article>
</template>

<style scoped>
.enriched-text {
  position: relative;
  width: calc(
    var(--col-count) * var(--spacing-enrichment-column-min-width)
    + (var(--col-count) - 1) * var(--spacing-enrichment-column-gap)
  );
  max-width: var(--spacing-book-page-content-max-width);
  min-width: var(--spacing-enrichment-column-min-width);
  color: var(--color-enrichment-text);
  font-family: var(--font-enrichment-body);
  font-size: var(--text-enrichment-body);
  line-height: var(--leading-enrichment-body);
}

.enriched-text__columns {
  display: flex;
  gap: var(--spacing-enrichment-column-gap);
  width: 100%;
}

.enriched-text__column {
  display: flex;
  flex-direction: column;
  flex: 0 0 var(--spacing-enrichment-column-min-width);
  gap: var(--spacing-enrichment-paragraph-gap);
  min-width: var(--spacing-enrichment-column-min-width);
}

.enriched-text__paragraph {
  display: grid;
  grid-template-columns: var(--spacing-enrichment-index-column) minmax(0, 1fr);
  gap: var(--spacing-enrichment-column-gap);
  margin: 0;
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
  display: block;
  margin: 0;
}

.enriched-text__lines:has(.enrichment-dropcap)::after {
  content: "";
  display: table;
  clear: both;
}

.enrichment-dropcap {
  display: inline-block;
  float: left;
  box-sizing: content-box;
  margin: 0;
  padding-right: 10px;
  color: var(--color-enrichment-text);
  font-family: var(--font-book-dropcap);
  font-size: calc(var(--text-book-dropcap-lines) * var(--leading-book-body) * 1em);
  line-height: 1;
  vertical-align: top;
  transform: translateY(-5px);
  shape-outside: border-box;
}

.enriched-text__line {
  display: block;
  line-height: var(--leading-enrichment-body);
  margin-left: calc(var(--indent-level) * var(--spacing-enrichment-indent-step));
  white-space: nowrap;
}

.enriched-text__italic {
  font-style: italic;
  white-space: pre;
}

.enriched-text__inline-indent {
  display: inline-block;
  margin-left: calc(var(--extra-indent-level) * var(--spacing-enrichment-indent-step));
}

.enriched-text__marked {
  position: relative;
  display: block;
  width: fit-content;
  max-width: 100%;
  margin-left: auto;
  padding: 1rem 1rem 1rem calc(0.9rem + 60px);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background-color: color-mix(in srgb, var(--color-book-marked-background) 50%, transparent);
  color: var(--color-book-marked-text);
  font-family: "Libertinus Mono", monospace;
  font-size: 0.75em;
  text-align: right;
  white-space: pre-line;
}

.enriched-text__marked::before {
  content: "";
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 10px;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--color-book-marked-background) 50%, transparent),
    color-mix(in srgb, #ffffff 10%, transparent)
  );
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

.enriched-text__espace {
  display: block;
  flex-shrink: 0;
  height: 0;
  margin: 0;
}

.enriched-text__image {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: calc(var(--spacing-enrichment-paragraph-gap) * 0.01) 0;
}

.enriched-text__image-el {
  display: block;
  max-width: 100%;
  height: auto;
}

.enriched-text__footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: var(--spacing-enrichment-paragraph-gap);
}

.enriched-text__nav-btn {
  display: block;
  width: 14px;
  height: 14px;
  background-color: #333333;
  transition: background-color 0.15s ease, transform 0.1s ease;
}

.enriched-text__nav-btn:hover {
  background-color: #4a4a4a;
}

.enriched-text__nav-btn:active {
  background-color: #222222;
  transform: scale(0.92);
}
</style>
