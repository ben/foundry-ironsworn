<template>
  <h4>legacy track: {{ ticks }} {{ xpSpent }}</h4>
</template>

<script>
export default {
  props: {
    actor: Object,
    propKey: String,
  },

  computed: {
    ticks() {
      return this.actor.data.legacies[this.propKey] || 0
    },
    xpSpent() {
      return this.actor.data.legacies[`${this.propKey}XpSpent`] || 0
    },
  },
}
</script>
