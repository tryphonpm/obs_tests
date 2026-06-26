<script setup lang="ts">
import textContent from '../../public/texts/36.txt?raw'
import pageTitleRaw from '../../public/texts/36.title.txt?raw'

const pageLabel = '36'
const pageTitle = pageTitleRaw.trim()
</script>

<template>
  <article class="book-page">
    <blockquote class="title-blockquote">
      {{ pageTitle }}
    </blockquote>

    <EnrichedText
      :content="textContent"
      :show-paragraph-indexes="false"
    />

    <p class="book-page__number">
      - {{ pageLabel }} -
    </p>
  </article>
</template>
