<template>
  <IronBtn
    class="move-chat"
    :tooltip="$t('IRONSWORN.SendToChat', { move: move.displayName })"
    @click="sendToChat"
    :disabled="disabled"
  >
    <template #icon>
      <FontIcon name="comment" />
    </template>
    <slot name="default"></slot>
  </IronBtn>
</template>

<style lang="less"></style>

<script setup lang="ts">
import { inject } from 'vue'
import { createSfMoveChatMessage } from '../../../chat/sf-move-chat-message'
import { Move } from '../../../features/custommoves'
import { $ItemKey } from '../../provisions.js'
import FontIcon from '../icon/font-icon.vue'
import IronBtn from './iron-btn.vue'

const props = defineProps<{
  move: Move
  disabled?: boolean
}>()

const $item = inject($ItemKey)

function sendToChat(e) {
  if ($item) createSfMoveChatMessage($item)
}
</script>
