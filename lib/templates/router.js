import Vue           from 'vue'
import Router        from 'vue-router'
import { deepMerge } from 'vues/utils'
import EventBus      from 'vues/event-bus'

<% let imported = [] %>

Vue.use(Router)

<% routes.forEach(route => { %>
  <% if (route.file.match(new RegExp(routerIgnore))) return %>
  <% imported.push(route.componentName) %>
  import {{ route.componentName }} from '{{ route.file }}'
<% }) %>

Vue.prototype.$routeOptions = {
  <% routes.forEach(route => { %>
    <% if (route.file.match(new RegExp(routerIgnore))) return %>

    '{{ route.name }}': {
      layout: {{ route.componentName }}.layout,
        title: {{ route.componentName }}.title,
        comp: {{ route.componentName }}
    },
  <% }) %>
}

const routes = [
  <% routes.forEach(route => { %>
    <% if (route.file.match(new RegExp(routerIgnore))) return %>
    { name: '{{ route.name }}', path: '{{ route.path }}', component: {{ route.componentName }} },
  <% }) %>
]

const routerConfig = {
  mode: 'history',
  routes
}

let configRouter = {{ router }}

if (typeof configRouter === 'function') {
  configRouter = configRouter.call(this)
}

const router = new Router(deepMerge(routerConfig, configRouter))

if (configRouter.beforeEach) {
  router.beforeEach((...args) => {
    configRouter.beforeEach(...args)
  })
}

export default router
