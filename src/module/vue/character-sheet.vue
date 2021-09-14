<template>
  <character-title :actor="actor"></character-title>
</template>

<script>
export default {
  props: {
    actor: Object
  },
  computed: {
    foo() {
      return inspect(this.actor, {depth: 5})
    }
  },
  created(...args) {
    console.log('created', args)
  },
  mounted(...args) {
    console.log('mounted', args)
  },
}
</script>
