<template>
  <isicon-button @click="rollMove()" :title="tooltip" class="move-roll" icon="d10-tilt">
    <slot></slot>
  </isicon-button>
</template>

<script>
export default {
  props: {
    actor: Object,
    move: Object,
    tooltip: String,
  },
  methods: {
    async rollMove() {
      CONFIG.IRONSWORN.SFRollMoveDialog.show(this.$actor, this.move.moveItem)
    },
  },
}
</script>
