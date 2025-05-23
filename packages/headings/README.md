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
  <h3><samp>@islands/headings</samp></h3>
  <img width="2000" height="0">
</p>
</td>
</tbody>
</table>
</p>

[îles]: https://github.com/nuraui/nurajs
[docs]: https://nuraui.com
[rehype]: https://github.com/rehypejs/rehype
[markdown]: https://nuraui.com/guide/markdown

An [îles] module that injects a [rehype] plugin to parse headings in
[MDX documents][markdown]:

- 🔗 adds an id to headings and injects an anchor tag to link them

- 🏷 automatically extracts the title from an `<h1>` and sets `frontmatter.title`

- 📖 sets `meta.headings` to enable rendering sidebars and table of contents

### Usage 🚀

```ts
// iles.config.ts
import { defineConfig } from 'iles'

export default defineConfig({
  modules: [
    '@islands/headings',
  ],
})
```
