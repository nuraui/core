<p align="center">
  <a href="https://nuraui.com">
    <img src="https://github.com/nuraui/nurajs/blob/main/docs/images/banner.png"/>
  </a>
</p>

<p align="center">
<table>
<tbody>
<td align="center">
<br/>
<p align="center">
  <h3><samp>@islands/excerpt</samp></h3>
  <img width="2000" height="0">
</p>
</td>
</tbody>
</table>
</p>

[îles]: https://github.com/nuraui/nurajs
[docs]: https://nuraui.com
[markdown]: https://nuraui.com/guide/markdown

[pageData]: https://nuraui.com/guide/project-structure#using-page-data
[SEO tags]: https://nuraui.com/guide/head-and-meta
[RSS feeds]: https://nuraui.com/guide/rss

An [îles] module to extract an excerpt from [MDX documents][markdown]:

- 📖 sets `meta.excerpt`, useful for [SEO tags] and [RSS feeds]

- 🏷 can render HTML by using the `excerpt` prop in an MDX component

- ⚙️ `maxLength`, `separator`, and `extract` options to customize excerpt


### Installation 💿

```ts
// iles.config.ts
import { defineConfig } from 'iles'

export default defineConfig({
  modules: [
    ['@islands/excerpt', { maxLength: 140 }],
  ],
})
```

### Usage 🚀

Use [`meta`][pageData] to access a text excerpt for the current page:

```js
const { meta } = usePage()
const text = meta.excerpt
```

When importing MDX components, you can also render an HTML version of the
excerpt by passing an `excerpt: true` prop.

```vue
<script setup>
import Introduction from '~/pages/intro.mdx'

const pages = useDocuments('~/pages/posts')
</script>

<template>
  <Introduction excerpt/>
  <template v-for="page in pages">
    <component :is="page" excerpt/>
  </template>
</template>
```
