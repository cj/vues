import Vue from 'vue'

<% filters.forEach(([name, path]) => { %>
    import * as {{ name }} from '{{ path }}'
<% }) %>

<% filters.forEach(([name]) => { %>
    Object.entries({{ name }}).forEach(([key, value]) => {
      if (key === 'default') {
        Vue.filter('{{ name }}', value)
      } else {
        Vue.filter(key, value)
      }
    })
<% }) %>
