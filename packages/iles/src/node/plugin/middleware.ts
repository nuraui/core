import { existsSync } from 'fs'
import pc from 'picocolors'
import { resolve, relative, extname } from 'pathe'
import type { ViteDevServer, Connect } from 'vite'
import createDebugger from 'debug'

import type { AppConfig } from '../shared'
import { ILES_APP_ENTRY } from '../constants'
import { createServer } from '../server'
import { pathToHtmlFilename } from '../utils'
import { exists } from './utils'

const supportedExtensions = new Set(['.html', '.xml', '.json', '.rss', '.atom'])

const debug = createDebugger('iles:html-page-fallback')

export function configureMiddleware (config: AppConfig, server: ViteDevServer, defaultLayoutPath: string) {
  restartOnConfigChanges(config, server)

  // If user included the vite vue plugin via their own vite.config.ts, then iles's vite vue plugin will consume a transformed sfc and error out. So, error out and alert user
  const vueVitePlugins = server.config.plugins.filter(plugin => plugin.name === 'vite-plugin-vue' || plugin.name === 'vite:vue')

  if (vueVitePlugins.length > 1) {
    throw new Error(`[îles] Duplicate Vue Vite plugin detected. Ensure @vitejs/plugin-vue is removed from the Vite plugins array in vite.config.ts or iles.config.ts. Use the 'vue' property in iles.config.ts to pass any configuration to the Vue Vite plugin which is already included by îles.\n`)
  }

  const htmlPagesMiddleware: Connect.NextHandleFunction = function ilesHtmlPagesMiddleware (req, res, next) {
    let { url = '' } = req

    url = pathToHtmlFilename(url)

    if (url.endsWith('.html')) {
      const filename = resolve(config.pagesDir, url.slice(1))
      if (existsSync(filename)) {
        url = `/${relative(config.root, filename)}`
        debug('Rewriting', req.method, req.url, 'to', url)
        req.url = url
      }
    }

    next()
  }

  server.middlewares.use(htmlPagesMiddleware)

  // serve our index.html after vite history fallback
  return () => {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url || ''

      // Let Vite process existing files.
      if (url.startsWith('/@fs/')) return next()
      const filename = resolve(config.root, url.slice(1))
      if (await exists(filename)) return next()

      // Fallback when the user has not created a default layout.
      if (url.includes(defaultLayoutPath)) {
        res.statusCode = 200
        res.setHeader('content-type', 'text/javascript')
        res.end('export default false')
      }
      else if (supportedExtensions.has(extname(url))) {
        res.statusCode = 200
        res.setHeader('content-type', 'text/html')

        let html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="${ILES_APP_ENTRY}"></script>
  </body>
</html>`
        html = await server.transformIndexHtml(url, html, req.originalUrl)
        res.end(html)
      }
      else {
        next()
      }
    })
  }
}

async function restartOnConfigChanges (config: AppConfig, server: ViteDevServer) {
  const restartIfConfigChanged = async (path: string) => {
    if (path === config.configPath) {
      server.config.logger.info(
        pc.green(
          `${relative(process.cwd(), config.configPath)} changed, restarting server...`,
        ),
        { clear: true, timestamp: true },
      )
      await server.close()
      // @ts-ignore
      global.__vite_start_time = Date.now()
      const { server: newServer } = await createServer(server.config.root, server.config.server)
      await newServer.listen()
    }
  }
  // Shut down the server and start a new one if config changes.
  server.watcher.add(config.configPath)
  server.watcher.on('add', restartIfConfigChanged)
  server.watcher.on('change', restartIfConfigChanged)
}
