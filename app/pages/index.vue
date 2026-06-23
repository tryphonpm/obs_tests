<script setup lang="ts">
type PageLink = {
  to: string
  label: string
}

const pageModules = import.meta.glob('./*.vue')
const titleModules = import.meta.glob('../../public/texts/*.title.txt', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const pageLinks = Object.keys(pageModules)
  .map((filePath) => filePath.replace(/^\.\/|\.vue$/g, ''))
  .filter((name) => name !== 'index')
  .map((name): PageLink => {
    const titlePath = `../../public/texts/${name}.title.txt`
    const title = titleModules[titlePath]?.trim()

    return {
      to: `/${name}`,
      label: title || name,
    }
  })
  .sort((a, b) => a.to.localeCompare(b.to, undefined, { numeric: true }))
</script>

<template>
  <div>
    <div class="mt-100">
      <p v-for="page in pageLinks" :key="page.to">
        <NuxtLink :to="page.to">
          {{ page.label }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
