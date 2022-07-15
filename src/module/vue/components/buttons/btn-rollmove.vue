<template>
  <btn-isicon
    @click="rollMove"
    :tooltip="tooltip"
    class="action-roll move-roll"
    icon="d10-tilt"
    aria-haspopup="dialog"
    :disabled="disabled"
  >
    <slot></slot>
  </btn-isicon>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import btnIsicon from './btn-isicon.vue'

export default defineComponent({
  props: {
    move: Object,
    tooltip: String,
    disabled: Boolean,
  },
  components: { btnIsicon },
  inject: ['$actor'],
  methods: {
    async rollMove() {
      CONFIG.IRONSWORN.SFRollMoveDialog.show(this.$actor, this.move.moveItem)
    },
  },
})
</script>
