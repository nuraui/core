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
  <h3><samp>@islands/mdx</samp></h3>
  <img width="2000" height="0">
</p>
</td>
</tbody>
</table>
</p>

[îles]: https://github.com/nuraui/nurajs
[docs]: https://nuraui.com
[MDX]: https://github.com/mdx-js/mdx
[frontmatter]: https://nuraui.com/guide/markdown#frontmatter-and-meta
[mdx documents]: https://nuraui.com/guide/markdown
[resolveComponent]: https://v3.vuejs.org/api/global-api.html#resolvecomponent
[unplugin-vue-components]: https://github.com/antfu/unplugin-vue-components

An [îles] module that adds support for [MDX documents], powered by [MDX].

It also injects a [recma][MDX] plugin to resolve Vue components in [MDX documents]:

- 🌎 you can use globally registered components
- 🧱 [`unplugin-vue-components`][unplugin-vue-components] can statically resolve and import components, so you don't need to manually provide components
- 📝 exposes data from plugins to [`meta`][mdx documents]
