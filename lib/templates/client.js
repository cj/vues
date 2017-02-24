import Vue    from 'vue'
import App    from '{{ vuesTmpDir }}/App'
import router from '{{ vuesTmpDir }}/router'

try {
  <% if (nodeEnv === 'development') { %>
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

  const app = new Vue({
    router,
    ...App
  })

  app.$mount('#vues')
} catch(e) {
  <% if (nodeEnv === 'development') { %>
    window.vuesLoadError = true
  <% } %>

  throw(e)
}
