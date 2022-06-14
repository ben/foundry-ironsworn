<template>
  <btn-faicon icon="flame" class="burn-momentum" @click="burnMomentum">
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