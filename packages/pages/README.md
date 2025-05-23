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
  <h3><samp>@islands/pages</samp></h3>
  <img width="2000" height="0">
</p>
</td>
</tbody>
</table>
</p>

[îles]: https://github.com/nuraui/nurajs
[docs]: https://nuraui.com
[pages]: https://nuraui.com/guide/project-structure#pages
[frontmatter]: /guide/markdown#frontmatter-and-meta
[routing]: https://nuraui.com/guide/routing
[vite-plugin-pages]: https://github.com/hannoeru/vite-plugin-pages

An [îles] module that provides support for [pages], inspired by [vite-plugin-pages].

- 🛣 file-based [routing]
- 🎣 hooks to extend [frontmatter] and route data
- 📄 adds support for a [`<page>` block][pages] in Vue single-file components

```ts
  extendFrontmatter (frontmatter, filename) {
    if (filename.includes('/posts/'))
      frontmatter.layout = 'post'
  },
  extendRoute (route) {
    if (route.path.startsWith('/posts'))
      route.path = path.replace(/[\d-]+/, '') // remove date
  },
  extendRoutes (routes) {
    routes.push({ path: '/custom', name: 'Custom', componentFilename: ... }))
  },
```

<kbd>extendFrontmatter</kbd> is very flexible, you could use it to:

- Infer the title or date from the filename
- Set a different layout for all pages in a specific dir
- Provide additional data to use in the page, such as `gitLastUpdated`

## Acknowledgements

- [`vite-plugin-pages`][vite-plugin-pages]: Early versions of îles used this wonderful library
