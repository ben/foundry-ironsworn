<template>
  <btn-faicon
    class="move-chat"
    icon="comment"
    :tooltip="tooltip"
    @click="sendToChat"
    :disabled="disabled"
  >
    <slot>
      <!-- {{$t('IRONSWORN.Chat')}} -->
    </slot>
  </btn-faicon>
</template>

<style lang="less"></style>

<script lang="ts">
import { defineComponent } from 'vue'
import btnFaicon from './btn-faicon.vue'

export default defineComponent({
  components: { btnFaicon },
  props: {
    move: Object,
    tooltip: String,
    disabled: Boolean,
  },
  methods: {
    sendToChat(e) {
      CONFIG.IRONSWORN.SFRollMoveDialog.createDataforgedMoveChat(
        this.move.moveItem
      )
    },
  },
})
</script>
