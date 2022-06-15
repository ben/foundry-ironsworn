<template>
  <btn-faicon
    class="move-chat"
    icon="comment"
    :tooltip="tooltip"
    @click="sendToChat"
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
