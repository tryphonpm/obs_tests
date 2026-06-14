<template>
  <div class="min-h-screen" style="background: var(--color-surface-50); color: var(--color-surface-900);">
    <header style="border-bottom: 1px solid var(--color-surface-300);">
      <nav class="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/" style="font-family: var(--font-display); font-size: var(--text-xl); letter-spacing: var(--tracking-tight);">
          OBS_01
        </NuxtLink>
        <ul class="flex gap-6" style="font-family: var(--font-sans); font-size: var(--text-sm); font-weight: 500;">
          <li><NuxtLink to="/" style="transition: color var(--duration-base);" class="hover:text-[var(--color-brand-400)]">Accueil</NuxtLink></li>
          <li><NuxtLink to="/blog" style="transition: color var(--duration-base);" class="hover:text-[var(--color-brand-400)]">Blog</NuxtLink></li>
        </ul>
      </nav>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-10">
      <slot />
    </main>

    <footer style="border-top: 1px solid var(--color-surface-300); margin-top: 5rem;">
      <div class="mx-auto max-w-5xl px-4 py-6 text-center" style="font-size: var(--text-sm); color: var(--color-surface-600);">
        © {{ new Date().getFullYear() }} OBS_01
      </div>
    </footer>
  </div>
</template>
