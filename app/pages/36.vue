<script setup lang="ts">
import textContent from '../../public/texts/36.txt?raw'
</script>

<template>
  <article class="book-page">
    <blockquote class="title-blockquote">
      La galaxie, le châtiment et le Kavalier.
    </blockquote>

    <EnrichedText
      :content="textContent"
      :show-paragraph-indexes="false"
    />

    <p class="book-page__number">
      - 36 -
    </p>
  </article>
</template>
