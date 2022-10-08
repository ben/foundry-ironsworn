<template>
  <h1>Hi, I'm a page! Yay!</h1>
  <pre><code>{{JSON.stringify(data, null, 2)}}</code></pre>
</template>

<script setup lang="ts">
defineProps<{ data: any }>()
</script>
