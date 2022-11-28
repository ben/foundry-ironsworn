<template>
  <btn-faicon
    class="move-chat"
    icon="comment"
    :tooltip="$t('IRONSWORN.SendToChat', { move: move.displayName })"
    @click="sendToChat"
    :disabled="disabled"
  >
    <slot name="default"></slot>
  </btn-faicon>
</template>

<style lang="less"></style>

<script setup lang="ts">
import { inject } from 'vue'
import { createSfMoveChatMessage } from '../../../chat/sf-move-chat-message'
import { Move } from '../../../features/custommoves'
import { $ItemKey } from '../../provisions.js'
import btnFaicon from './btn-faicon.vue'

const props = defineProps<{
  move: Move
  disabled?: boolean
}>()

const $item = inject($ItemKey)

function sendToChat(e) {
  if ($item) createSfMoveChatMessage($item)
}
</script>
