<script client:load lang="ts">
import type { OnLoadFn } from 'iles'

export const onLoad: OnLoadFn = (el: HTMLElement) =>
  el.previousElementSibling?.addEventListener('click', () => {
    document.querySelector<HTMLElement>('.DocSearch-Button')?.click()
  })
</script>

<template>
  <DocSearch class="hidden" client:idle/>
  <NavBarButton aria-label="Search">
    <IconBxBxSearch/>
  </NavBarButton>
</template>
