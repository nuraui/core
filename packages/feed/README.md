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
  <h3><samp>@islands/feed</samp></h3>
  <img width="2000" height="0">
</p>
</td>
</tbody>
</table>
</p>

[îles]: https://github.com/nuraui/nurajs
[routing]: https://nuraui.com/guide/routing
[feed]: https://github.com/jpmonette/feed
[rss]: https://nuraui.com/guide/rss

An [îles] module to generate feeds for your site:

- 📻 supports RSS, Atom, and JSON feeds

- ⚡️ HMR during development to debug the result

- 💪🏼 strongly typed, powered by [`feed`][feed]

### Installation 💿

```ts
// iles.config.ts
import { defineConfig } from 'iles'

export default defineConfig({
  modules: [
    '@islands/feed',
  ],
})
```

See the [_RSS Feeds_ section of the docs][rss] for usage instructions.
