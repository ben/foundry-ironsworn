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

<script>
export default {
  props: {
    move: Object,
    tooltip: String,
    disabled: Boolean,
  },
  methods: {
    sendToChat(e) {
      e.preventDefault()
      CONFIG.IRONSWORN.SFRollMoveDialog.createDataforgedMoveChat(
        this.move.moveItem
      )
    },
  },
}
</script>
