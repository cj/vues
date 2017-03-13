import Vue from 'vue'

<% filters.forEach(([name, path]) => { %>
    import * as {{ name }} from '{{ path }}'
<% }) %>

let filters = {}

<% filters.forEach(([name]) => { %>
    Object.entries({{ name }}).forEach(([key, value]) => {
      if (key === 'default') {
        filters['{{ name }}'] = value
        Vue.filter('{{ name }}', value)
      } else {
        filters[key] = value
        Vue.filter(key, value)
      }
    })
<% }) %>

Vue.prototype.$filters = filters
