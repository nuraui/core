<page>
alias: ['/posts']
</page>

<script setup lang="ts">

let posts = $(getPosts())
</script>

<template>
  <div class="divide-y divide-gray-200">
    <div class="pt-6 pb-8 space-y-2 md:space-y-5">
      <h1
        class="text-3xl leading-9 font-extrabold text-gray-900 tracking-tight sm:text-4xl sm:leading-10 md:text-6xl"
      >
        {{ $site.title }}
      </h1>
      <p class="text-lg leading-7 text-gray-500">{{ $site.description }}</p>
      <slot/>
    </div>
    <ul class="divide-y divide-gray-200">
      <li v-for="post of posts" :key="post.href" class="py-12">
        <article
          class="space-y-2 xl:(grid grid-cols-4 space-y-0 items-baseline)"
        >
          <PostDate :date="post.date"/>
          <div class="space-y-5 xl:col-span-3">
            <div class="space-y-6">
              <h2 class="text-2xl leading-8 font-bold tracking-tight">
                <a class="text-gray-900" :href="post.href">{{ post.title }}</a>
              </h2>
              <div class="max-w-none prose text-gray-500">
                <component :is="post" excerpt/>
              </div>
            </div>
            <div class="text-base leading-6 font-medium">
              <a class="link" aria-label="read more" :href="post.href">Read more →</a>
            </div>
          </div>
        </article>
      </li>
    </ul>
  </div>
</template>
