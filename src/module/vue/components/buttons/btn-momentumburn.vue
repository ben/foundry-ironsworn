<template>
  <btn-faicon
    icon="fire"
    class="burn-momentum"
    @click="burnMomentum"
    :disabled="disabled"
  >
    <slot></slot>
  </btn-faicon>
</template>

<script>
export default {
  props: {
    actor: Object,
    disabled: Boolean,
  },
  methods: {
    burnMomentum() {
      this.$actor.burnMomentum()
    },
  },
}
</script>
