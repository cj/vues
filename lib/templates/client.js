import Vue from 'vue'
import App from '{{ vuesTmpDir }}/App'

require('~/test.css')

const app = new Vue({
  ...App
})

app.$mount('#vues')
