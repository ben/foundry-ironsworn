<template>
  <div class="flexcol">
    <character-header :actor="actor"></character-header>
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
