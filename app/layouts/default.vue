<template>
  <div class="min-h-screen" style="background: var(--color-book-background); color: var(--color-book-text);">
    <header style="border-bottom: 1px solid var(--color-book-rule);">
      <nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 pl-5">
        <NuxtLink
          to="/"
          style="font-family: var(--font-book-title); font-size: var(--text-xl); letter-spacing: var(--tracking-book-body);"
        >
          Bac à Fables
        </NuxtLink>
        <ul class="flex gap-6" style="font-family: var(--font-sans); font-size: var(--text-sm); font-weight: 500;">
          <li>
            <NuxtLink
              to="/"
              class="nav-marked-link"
            >
              TDM
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-10">
      <slot />
    </main>

    <footer style="border-top: 1px solid var(--color-book-rule); margin-top: 5rem;">
      <div
        class="mx-auto max-w-5xl px-4 py-6 text-center"
        style="font-size: var(--text-sm); color: var(--color-book-text-muted);"
      >
        © {{ new Date().getFullYear() }} PublicationsDésordonnées
      </div>
    </footer>
  </div>
</template>
