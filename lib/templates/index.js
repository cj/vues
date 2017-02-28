import Vue      from 'vue'
import App      from 'vues/App'
import router   from 'vues/router'
import vues     from 'vues/vues'
import EventBus from 'vues/event-bus'
<% let imported = ['router', 'app'] %>

<% if (hasStores) { %>
  <% imported.push('store')  %>
  import store from 'vues/store'
  import { sync } from 'vuex-router-sync'

  sync(store, router)
<% } %>

<% if (hasFilters) { %>
  require('vues/filters')
<% } %>

<% plugins.forEach(plugin => { %>
  <% let name = _.camelCase(plugin) %>
  <% imported.push(name) %>
  import {{ name }} from '{{ plugin }}'
  Vue.use({{ name }})
<% }) %>

let app

window.Vue = Vue

try {
  <% if (nodeEnv === 'development') { %>
    require('event-source-polyfill')

    window.addEventListener('unhandledrejection', event => {
      // Prevent error output on the console:
      event.preventDefault();
      console.warn('Unhandled Error: ' + event);

      window.vuesLoadError = true
    })

    const hotClient = require('webpack-hot-middleware/client?reload=true')

    hotClient.subscribeAll(event => {
      if (event.action === 'reload' || (
        (window.vuesLoadError || window.vuesConfigUpdated) && event.action === 'built'
      )) {
        window.vuesConfigUpdated = false
        window.vuesLoadError = false
        window.location.reload()
      }

      if (event.action === 'vuesConfigUpdated') {
        window.vuesConfigUpdated = true
      }
    })
  <% } %>

  Vue.component('vues', vues)

  app = new Vue({
    router,
    <% if (hasStores) { %>
      store,
    <% } %>
    ...App
  })

} catch(e) {
  <% if (nodeEnv === 'development') { %>
    window.vuesLoadError = true
  <% } %>

  throw(e)
}

export { <% imported.forEach(name => { %> {{ name }}, <% }) %> }
