<script setup lang="ts">
import textContentRaw from '../../public/texts/61.txt?raw'

const pageLabel = '61'
const pageTitle = "Ba*(lzac == ch)"
const textContent = textContentRaw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').slice(1).join('\n')
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
