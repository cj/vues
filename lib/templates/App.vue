<template>
  <div id="vues">
    <div v-if='layout'>
      <component v-bind:is="layout"></component>
    </div>
    <div v-else>
      <vues />
    </div>
  </div>
</template>

<script>
  import vues     from 'vues/vues'
  import EventBus from 'vues/event-bus'
  <% layouts.forEach(layout => { %>
      import {{ layout.name }} from '{{ layout.path }}'
  <% }) %>

  const vuesLayouts = {
    <% layouts.forEach(layout => { %>
      {{ layout.name }},
    <% }) %>
  }

  const vuesTitle = "{{ title }}"
  const vuesTitleTemplate = <% if (titleTemplate) { %> "{{ titleTemplate }}" <% } else { %> null <% } %>

  export default {
    props: {
      layout: {}
    },

    created () {
      this.updateLayout()
    },

    methods: {
      updateLayout () {
        const { layout, title } = this.$routeOptions[this.$route.name] || {}

        this.layout = vuesLayouts[`${layout}Layout`] || ( vuesLayouts.defaultLayout || vues )

        if (title && vuesTitleTemplate) {
          document.title = vuesTitleTemplate.replace(/\{\{\s{0,2}viewTitle\s{0,2}\}\}/, title)
        } else {
          document.title = vuesTitle
        }
      }
    },

    watch: {
      $route () {
        this.updateLayout()
      }
    },

    mixins: [{
      <% hooks.forEach(hook => { %>
        {{ hook.name }} () {
          {{ hook.callback }}
          {{ hook.name }}.call(this)
        },
      <% }) %>
    }]
  }
</script>

<% styles.forEach((style) => { %>
  <style src='{{ style.src }}' lang='{{ style.lang || "css" }}'><style>
<% }) %>
