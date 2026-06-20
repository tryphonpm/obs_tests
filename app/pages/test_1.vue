<script setup lang="ts">
import prometheusImage from '~/assets/img/prometheusz.jpg'
import textContent from '../../public/texts/test_1.txt?raw'
</script>

<template>
  <div class="grid h-full grid-cols-[380px_760px] gap-16 p-16">
<!--     <aside class="flex items-center justify-center">
      <img
        :src="prometheusImage"
        alt="Illustration orange et noire de Prométhée"
        class="h-[380px] w-[380px] object-cover"
      >
    </aside> -->

    <section class="flex w-[760px] min-w-0 flex-col justify-center space-y-6">
<!--       <div class="space-y-3">
        <span class="tag">Bac à Fables</span>
        <p style="font-size: var(--text-lg); color: var(--color-surface-700);">
          Compendium @2023.
        </p>
      </div> -->

      <blockquote style="font-family: var(--font-display); font-size: var(--text-5xl); line-height: 1.15; color: var(--color-surface-900);">
        Art, billes, corps.
      </blockquote>

<!--       <div class="space-y-1">
        <h2 style="font-family: var(--font-sans); font-size: var(--text-xl); font-weight: 700; color: var(--color-brand-400);">
          Philippe Moreau
        </h2>

      </div> -->

      <EnrichedText :content="textContent" />
    </section>
  </div>
</template>
