import { createApp as createClientApp, createSSRApp, ref } from 'vue'
import { createMemoryHistory, createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { createHead } from '@unhead/vue'

import routes from '@islands/routes'
import config from '@islands/app-config'
import type { CreateAppFactory, AppContext, RouterOptions, UserApp, UserSite } from '../shared'
import App from './components/App.vue'
import { installPageData, forcePageUpdate } from './composables/pageData'
import { installMDXComponents } from './composables/mdxComponents'
import { installAppConfig } from './composables/appConfig'
import { defaultHead } from './head'
import { resolveLayout } from './layout'
import { resolveProps } from './props'

const newApp = import.meta.env.SSR ? createSSRApp : createClientApp

function createRouter (base: string | undefined, routerOptions: Partial<RouterOptions>) {
  if (base === '/') base = undefined

  return createVueRouter({
    scrollBehavior: (current, previous, savedPosition) => {
      if (savedPosition) return savedPosition
      if (current.path !== previous.path && !current.hash) return { top: 0 }
      if (current.hash) return { top: document.querySelector<HTMLElement>(current.hash)?.offsetTop || 0 }
    },
    ...routerOptions,
    routes,
    history: import.meta.env.SSR ? createMemoryHistory(base) : createWebHistory(base),
  })
}

function unwrapModule (mod: any): any {
  return mod && mod.default ? unwrapModule(mod.default) : mod
}

export const createApp: CreateAppFactory = async (options = {}) => {
  let userApp: UserApp
  try {
    userApp = unwrapModule(await import('@islands/user-app'))
  }
  catch (err) {
    userApp = {}
  }
  
  let siteRef: UserSite
  try {
    siteRef = unwrapModule(await import('@islands/user-site'))
  }
  catch (err) {
    siteRef = {}
  }
  
  const { head: headConfig, enhanceIslands, enhanceApp, router: routerOptions } = userApp
  const { routePath = config.base, ssrProps } = options

  const app = newApp(App)

  installAppConfig(app, config)

  const head = createHead()
  app.use(head)

  const router = createRouter(config.base, routerOptions)
  app.use(router)
  router.beforeResolve(resolveLayout)
  router.beforeResolve(async route => await resolveProps(route, ssrProps))

  // Set the path that should be rendered.
  if (import.meta.env.SSR) {
    router.push(routePath)
    await router.isReady()
  }

  const { frontmatter, meta, page, props, route, site } = installPageData(app, siteRef)
  Object.defineProperty(app.config.globalProperties, '$frontmatter', { get: () => frontmatter })
  Object.defineProperty(app.config.globalProperties, '$meta', { get: () => meta })
  Object.defineProperty(app.config.globalProperties, '$site', { get: () => site })

  const context: AppContext = {
    app,
    config,
    head,
    frontmatter,
    meta,
    props,
    site,
    page,
    route,
    router,
    routes,
  }
  head.push(defaultHead(context, userApp.socialTags))
  // useHead(ref(defaultHead(context, userApp.socialTags)))

  // Apply any configuration added by the user in app.ts
  // if (headConfig) useHead(ref(typeof headConfig === 'function' ? headConfig(context) : headConfig))
  if (headConfig) head.push(ref(typeof headConfig === 'function' ? headConfig(context) : headConfig))
  
  // enhanceIslands is called on the shell app during development otherwise user will have to duplicate `app.use(pinia)` in both enhanceIslands and enhanceApp
  if (enhanceIslands) {
    await enhanceIslands({ app })
  }
  if (enhanceApp) {
    await enhanceApp(context)
  }
  await installMDXComponents(context, userApp)

  return context
}

if (!import.meta.env.SSR) {
  (async () => {
    const { app, router } = await createApp()

    const devtools = await import('./composables/devtools')
    devtools.installDevtools(app, config)
    Object.assign(window, { __ILES_PAGE_UPDATE__: forcePageUpdate })

    await router.isReady() // wait until page component is fetched before mounting
    app.mount('#app', true)
  })()
}
