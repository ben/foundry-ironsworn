<template>
  <btn-faicon icon="flame" class="burn-momentum">
    <slot></slot>
  </btn-faicon>
</template>

<script>
export default {
  props: {
    actor: Object,
  },
  methods: {
    burnMomentum() {
      this.$actor.burnMomentum()
    }
  }
}
</script>