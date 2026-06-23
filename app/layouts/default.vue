<template>
  <div class="layout-page">
    <main class="layout-main mx-auto w-fit px-4">
      <slot class="mt-100"/>
    </main>

<!--     <footer class="layout-footer" style="border-top: 1px solid var(--color-book-rule);">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 pl-5">
        <NuxtLink
          to="/"
          style="font-family: var(--font-book-title); font-size: var(--text-xl); letter-spacing: var(--tracking-book-body);"
        >
          Bac à Fables
        </NuxtLink>

        <p
          class="m-0 text-right"
          style="font-size: var(--text-sm); color: var(--color-book-text-muted);"
        >
          © {{ new Date().getFullYear() }} PublicationsDésordonnées
        </p>
      </div>
    </footer> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let viewportHeight = 0

function resetScrollAfterViewportChange() {
  if (import.meta.server) {
    return
  }

  requestAnimationFrame(() => {
    window.scrollTo(0, 0)
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  })
}

function onFullscreenChange() {
  if (!document.fullscreenElement) {
    resetScrollAfterViewportChange()
  }
}

function onViewportResize() {
  const nextHeight = window.innerHeight
  if (nextHeight < viewportHeight - 24) {
    resetScrollAfterViewportChange()
  }
  viewportHeight = nextHeight
}

onMounted(() => {
  viewportHeight = window.innerHeight
  document.addEventListener('fullscreenchange', onFullscreenChange)
  window.addEventListener('resize', onViewportResize)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  window.removeEventListener('resize', onViewportResize)
})
</script>
