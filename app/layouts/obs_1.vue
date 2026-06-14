<template>
  <div class="obs-stage">
    <main class="obs-frame">
      <slot />
    </main>
  </div>
</template>

<style>
.obs-stage {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.obs-frame {
  width: 1920px;
  height: 1080px;
  border: 4px solid var(--color-brand-400);
  /* background-color: var(--color-surface-0); */
  font-family: var(--font-sans);
  overflow: hidden;
  flex-shrink: 0;
}
</style>
