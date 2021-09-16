<template>
  <div class="flexcol">
    <character-title :actor="actor"></character-title>
    <pre><code>{{foo}}</code></pre>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
  },
  computed: {
    foo() {
      return JSON.stringify(this.actor, null, 2)
    },
  },
}
</script>
