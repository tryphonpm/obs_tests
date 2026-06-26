<script setup lang="ts">
import textContent from '../../public/texts/52.txt?raw'

const pageLabel = '52'
const pageTitle = "La machette à couper les nombrils."
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
