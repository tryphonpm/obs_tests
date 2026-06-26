<script setup lang="ts">
import textContentRaw from '../../public/texts/83.txt?raw'

const pageLabel = '83'
const pageTitle = "A.... S... P.. M. || p"
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
