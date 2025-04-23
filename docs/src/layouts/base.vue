<script client:load lang="ts">
if (import.meta.env.PROD)
  console.log('Powered by îles 🏝', 'https://nuraui.com')
</script>

<template>
  <MetaTags/>
  <TheNavBar/>
  <slot/>
  <ReloadPrompt/>
</template>
