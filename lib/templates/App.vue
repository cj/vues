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
  import vues from 'vues/vues'
  import EventBus from 'vues/event-bus'
  <% layouts.forEach(layout => { %>
      import {{ layout.name }} from '{{ layout.path }}'
  <% }) %>

  const vuesLayouts = {
    <% layouts.forEach(layout => { %>
      {{ layout.name }},
    <% }) %>
  }

  export default {
    props: {
      layout: {}
    },
    beforeCreate () {
      EventBus.$on('vues:setLayout', (layout) => {
        this.layout = vuesLayouts[`${layout}Layout`] || ( vuesLayouts.defaultLayout || vues )
      })
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
