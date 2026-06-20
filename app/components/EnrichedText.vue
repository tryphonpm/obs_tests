<script setup lang="ts">
type EnrichedLine = {
  id: string
  text: string
  indentLevel: number
  lineIndexInParagraph: number
}

type EnrichedParagraph = {
  id: string
  paragraphIndexInPage: number
  lines: EnrichedLine[]
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

const paragraphs = computed<EnrichedParagraph[]>(() => {
  const normalizedContent = props.content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const textLines = normalizedContent.split('\n')
  const parsedParagraphs: EnrichedParagraph[] = []
  let currentLines: EnrichedLine[] = []

  function closeParagraph() {
    if (currentLines.length === 0) {
      return
    }

    const paragraphIndexInPage = parsedParagraphs.length

    parsedParagraphs.push({
      id: `paragraph-${paragraphIndexInPage}`,
      paragraphIndexInPage,
      lines: currentLines,
    })

    currentLines = []
  }

  textLines.forEach((line) => {
    if (line.trim().length === 0) {
      closeParagraph()
      return
    }

    currentLines.push({
      id: `paragraph-${parsedParagraphs.length}-line-${currentLines.length}`,
      text: line.trimStart(),
      indentLevel: getIndentLevel(line),
      lineIndexInParagraph: currentLines.length,
    })
  })

  closeParagraph()

  return parsedParagraphs
})
</script>

<template>
  <article class="enriched-text" aria-label="Texte enrichi">
    <section
      v-for="paragraph in paragraphs"
      :key="paragraph.id"
      class="enriched-text__paragraph"
      :data-paragraph-index="paragraph.paragraphIndexInPage"
    >
      <span
        v-if="showParagraphIndexes"
        class="enriched-text__paragraph-index"
        aria-hidden="true"
      >
        {{ String(paragraph.paragraphIndexInPage + 1).padStart(2, '0') }}
      </span>

      <p class="enriched-text__lines">
        <span
          v-for="line in paragraph.lines"
          :key="line.id"
          class="enriched-text__line"
          :data-line-index="line.lineIndexInParagraph"
          :style="{ '--indent-level': line.indentLevel }"
        >
          {{ line.text }}
        </span>
      </p>
    </section>
  </article>
</template>

<style scoped>
.enriched-text {
  display: grid;
  gap: 1.15rem;
  color: var(--color-surface-700);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: 1.7;
}

.enriched-text__paragraph {
  position: relative;
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr);
  gap: 1rem;
}

.enriched-text__paragraph::before {
  content: "";
  position: absolute;
  left: 3.05rem;
  top: 0.4rem;
  bottom: 0.35rem;
  width: 1px;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--color-brand-400) 55%, transparent),
    transparent
  );
}

.enriched-text__paragraph-index {
  align-self: start;
  color: var(--color-brand-400);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  opacity: 0.75;
}

.enriched-text__lines {
  display: grid;
  gap: 0.15rem;
  margin: 0;
}

.enriched-text__line {
  display: block;
  margin-left: calc(var(--indent-level) * 1.35rem);
  text-wrap: pretty;
}
</style>
