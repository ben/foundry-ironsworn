<template>
  <btn-faicon
    class="move-chat"
    icon="comment"
    :tooltip="$t('IRONSWORN.SendToChat')"
    @click="sendToChat"
    :disabled="disabled"
  >
    <slot name="default"><!-- {{$t('IRONSWORN.Chat')}} --></slot>
  </btn-faicon>
</template>

<style lang="less"></style>

<script setup lang="ts">
import { createSfMoveChatMessage } from '../../../chat/sf-move-chat-message'
import { Move } from '../../../features/custommoves'
import btnFaicon from './btn-faicon.vue'

const props = defineProps<{
  move: Move
  disabled?: boolean
}>()

function sendToChat(e) {
  createSfMoveChatMessage(props.move.moveItem)
}
</script>
