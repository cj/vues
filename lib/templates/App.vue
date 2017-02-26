<template>
  <div id="vues">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    <% hooks.forEach(hook => { %>
      {{ hook.name }} () {
        {{ hook.callback }}
        {{ hook.name }}.call(this)
      },
    <% }) %>
  }
</script>

<% styles.forEach((style) => { %>
  <style src='{{ style.src }}' lang='{{ style.lang || "css" }}'><style>
<% }) %>
