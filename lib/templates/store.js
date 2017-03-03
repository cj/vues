import Vue           from 'vue'
import Vuex          from 'vuex'
import { deepMerge } from 'vues/utils'
<% stores.forEach(store => { %>
    import {{ store.componentName }} from '{{ store.path }}'
<% }) %>

<% stores.forEach(store => { %>
  // namespace stores by default
  if (typeof {{ store.componentName }}.namespaced === 'undefined') {
    {{ store.componentName }}.namespaced = true
  }
<% }) %>

Vue.use(Vuex)

let storeConfig = {
  strict: process.env.NODE_ENV !== 'production',
  namespace: true,
  state: {},
  modules: { <% stores.forEach(store => { %> {{ store.name }}:{{ store.componentName }}, <% }) %> }
}

let vuesStoreConfig = {{ storeConfig }}

if (typeof vuesStoreConfig === 'function') {
  vuesStoreConfig = vuesStoreConfig.call(this)
}

const store = new Vuex.Store(deepMerge(storeConfig, vuesStoreConfig))

<% if (nodeEnv === 'development') { %>
  if (module.hot) {
    module.hot.accept([<% stores.forEach(store => { %> '{{ store.path }}', <% }) %>], () => {
      // accept actions and mutations as hot modules
      <% stores.forEach(store => { %>
          // require the updated modules
          // have to add .default here due to babel 6 module output
          const {{ store.componentName }}New = require('{{ store.path }}').default

          if (typeof {{ store.componentName }}New.namespaced === 'undefined') {
            {{ store.componentName }}New.namespaced = true
          }
      <% }) %>
      // swap in the new actions and mutations
      store.hotUpdate({
        modules: { <% stores.forEach(store => { %> {{ store.name }}:{{ store.componentName }}New, <% }) %> }
      })
    })
  }
<% } %>

export default store
