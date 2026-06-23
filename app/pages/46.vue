<script setup lang="ts">
import textContent from '../../public/texts/46.txt?raw'
</script>

<template>
  <article class="book-page">
    <blockquote class="title-blockquote">
      Art, billes, corps.
    </blockquote>

    <EnrichedText
      :content="textContent"
      :show-paragraph-indexes="false"
    />

    <p class="book-page__number">
      - 46 -
    </p>
  </article>
</template>
