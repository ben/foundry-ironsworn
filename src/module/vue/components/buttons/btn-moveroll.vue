<template>
  <btn-isicon
    v-if="isProgressMove"
    @click="rollMove()"
    :title="tooltip"
    class="progress-roll move-roll"
    icon="d10-tilt"
  >
    <slot></slot>
  </btn-isicon>
  <btn-svgicon
    v-else
    @click="rollMove()"
    :title="tooltip"
    class="action-roll move-roll"
    icon="d6-pips"
    aria-haspopup="dialog"
  >
    <slot></slot>
  </btn-svgicon>
</template>

<script>
export default {
  props: {
    actor: Object,
    move: Object,
    tooltip: String,
  },
  computed: {
    isProgressMove() {
      return this.move.moveItem?.data?.data?.['Progress Move']
    },
  },
  methods: {
    async rollMove() {
      CONFIG.IRONSWORN.SFRollMoveDialog.show(this.$actor, this.move.moveItem)
    },
  },
}
</script>
