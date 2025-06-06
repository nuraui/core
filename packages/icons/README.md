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
  <h3><samp>@islands/icons</samp></h3>
  <img width="2000" height="0">
</p>
</td>
</tbody>
</table>
</p>

[îles]: https://github.com/nuraui/nurajs
[components]: https://nuraui.com/guide/project-structure
[unplugin-icons]: https://github.com/antfu/unplugin-icons

An [îles] module to add and configure [unplugin-icons]:

- ✨ `autoInstall` enabled by default, and `icon` prefix to prevent conflicts

- 🧱 configures the `unplugin-vue-components` resolver automatically

- 🎨 files in the `/icons` dir available as the `app` collection, `<IconApp...`


### Usage 🚀

```ts
// iles.config.ts
import { defineConfig } from 'iles'

export default defineConfig({
  modules: [
    '@islands/icons',
  ],
})
```
