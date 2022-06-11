<template>
  <isicon-button
    v-if="isProgressMove"
    @click="rollMove()"
    :title="tooltip"
    class="opens-dialog progress-roll move-roll"
    icon="d10-tilt"
  >
    <slot></slot>
  </isicon-button>
  <svgicon-button v-else @click="rollMove()" :title="tooltip" class="opens-dialog action-roll move-roll" icon="d6-pips">
    <slot></slot>
  </svgicon-button>
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
