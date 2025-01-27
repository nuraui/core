<script setup lang="ts">
import {$fetch} from 'ofetch'

const data = ref({
  url: ''
})
const isLoading = ref(true)
const error = ref(false)

await $fetch('https://api.thecatapi.com/v1/images/search', {
  async onResponse({request, response, options}) {
    data.value = response._data[0]
    isLoading.value = false        
  },
  async onResponseError({request, response, options}) {
    error.value = true
  },
})
</script>

<template>
  <p v-if="isLoading">Loading...</p>
  <img
    v-else
    :src="data.url"
    alt="Boots"
    style="object-fit: cover; max-height: 600px"
  />
  <p v-if="error">Oops! An error occured, please try again.</p>
</template>

<!-- If handling suspense manually, use this alternate template -->
<!-- <template>
  <Suspense>
    <CatOfTheDay/>
    <template #fallback><p>Loading...</p></template>
  </Suspense>
</template> -->

<style scoped></style>
