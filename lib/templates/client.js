import Promise from 'promise-polyfill'

if (!window.Promise) { window.Promise = Promise }

import Vue    from 'vue'
import App    from '{{ vuesTmpDir }}/App'
import router from '{{ vuesTmpDir }}/router'

const app = new Vue({
  router,
  ...App
})

app.$mount('#vues')
