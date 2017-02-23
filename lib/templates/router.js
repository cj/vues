import Vue       from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

<% routes.forEach(route => { %>
    import {{ route.name }} from '{{ route.file }}'
<% }) %>

const routes = [
  <% routes.forEach(route => { %>
    { name: '{{ route.name }}', path: '{{ route.path }}', component: {{ route.name }} },
  <% }) %>
]

const routerConfig = {
  mode: 'history',
  routes
}

const configRouter = {{ router }}

const router = new VueRouter({ ...routerConfig, ...configRouter })

export default router
