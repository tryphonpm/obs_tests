<template>
  <div class="min-h-screen" style="background: var(--color-book-background); color: var(--color-book-text);">
    <main class="layout-main mx-auto w-fit px-4">
      <slot />
    </main>

    <footer class="layout-footer" style="border-top: 1px solid var(--color-book-rule);">
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
    </footer>
  </div>
</template>
