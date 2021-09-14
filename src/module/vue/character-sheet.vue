<template>
  <character-title :actor="actor"></character-title>
</template>


<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['actor']
})
</script>
