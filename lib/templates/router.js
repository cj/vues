import Vue           from 'vue'
import VueRouter     from 'vue-router'
import { deepMerge } from 'vues/utils'
import EventBus      from 'vues/event-bus'

<% let imported = [] %>

Vue.use(VueRouter)

<% routes.forEach(route => { %>
  <% imported.push(route.componentName) %>
  import {{ route.componentName }} from '{{ route.file }}'
<% }) %>

  const layoutMixin = {
    beforeCreate () {
      EventBus.$emit('vues:setLayout', this.$options.layout)
    }
  }

  <% routes.forEach(route => { %>
    {{ route.componentName }}.mixins = [layoutMixin]
  <% }) %>

const routes = [
  <% routes.forEach(route => { %>
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

const router = new VueRouter(deepMerge(routerConfig, configRouter))

if (configRouter.beforeEach) {
  router.beforeEach((...args) => {
    configRouter.beforeEach(...args)
  })
}

export default router
