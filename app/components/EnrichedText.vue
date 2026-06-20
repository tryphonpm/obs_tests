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
  position: relative;
  display: grid;
  gap: var(--spacing-enrichment-paragraph-gap);
  padding: var(--spacing-enrichment-padding-block) var(--spacing-enrichment-padding-inline);
  overflow: hidden;
  border: 1px solid var(--color-enrichment-border);
  border-radius: var(--radius-enrichment-panel);
  background:
    radial-gradient(circle at top left, var(--color-enrichment-glow), transparent 34rem),
    linear-gradient(145deg, var(--color-enrichment-background-soft), var(--color-enrichment-background));
  box-shadow: var(--shadow-enrichment-panel);
  color: var(--color-enrichment-text);
  font-family: var(--font-enrichment-body);
  font-size: var(--text-enrichment-body);
  line-height: var(--leading-enrichment-body);
}

.enriched-text::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(color-mix(in srgb, var(--color-enrichment-text-muted) 10%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--color-enrichment-text-muted) 8%, transparent) 1px, transparent 1px);
  background-size: 2rem 2rem;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.42), transparent 62%);
}

.enriched-text__paragraph {
  position: relative;
  display: grid;
  grid-template-columns: var(--spacing-enrichment-index-column) minmax(0, 1fr);
  gap: var(--spacing-enrichment-column-gap);
}

.enriched-text__paragraph::before {
  content: "";
  position: absolute;
  left: var(--spacing-enrichment-rule-left);
  top: var(--spacing-enrichment-rule-top);
  bottom: var(--spacing-enrichment-rule-bottom);
  width: var(--spacing-enrichment-rule-width);
  background: linear-gradient(
    to bottom,
    var(--color-enrichment-rule),
    transparent
  );
  box-shadow: 0 0 18px var(--color-enrichment-glow);
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
  text-wrap: pretty;
  text-shadow: 0 0 16px color-mix(in srgb, var(--color-enrichment-text) 16%, transparent);
}
</style>
