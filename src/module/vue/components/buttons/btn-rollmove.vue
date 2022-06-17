<template>
  <btn-isicon
    @click="rollMove()"
    :tooltip="tooltip"
    class="action-roll move-roll"
    icon="d10-tilt"
    aria-haspopup="dialog"
    :disabled="disabled"
  >
    <slot></slot>
  </btn-isicon>
</template>

<script>
export default {
  props: {
    actor: Object,
    move: Object,
    tooltip: String,
    disabled: Boolean,
  },
  methods: {
    async rollMove() {
      CONFIG.IRONSWORN.SFRollMoveDialog.show(this.$actor, this.move.moveItem)
    },
  },
}
</script>
