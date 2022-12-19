<template>
  <IronBtn
    class="move-chat"
    :tooltip="$t('IRONSWORN.SendToChat', { move: move.displayName })"
    @click="sendToChat"
    icon="fa:comment"
    v-bind="($props, $attrs)"
  >
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </IronBtn>
</template>

<style lang="scss"></style>

<script setup lang="ts">
import { ExtractPropTypes, inject } from 'vue'
import { createSfMoveChatMessage } from '../../../chat/sf-move-chat-message'
import { Move } from '../../../features/custommoves'
import { $ItemKey } from '../../provisions.js'
import IronBtn from './iron-btn.vue'

interface Props extends Omit<ExtractPropTypes<typeof IronBtn>, 'tooltip'> {
  move: Move
}

defineProps<Props>()

const $item = inject($ItemKey)

function sendToChat(e) {
  if ($item) createSfMoveChatMessage($item)
}
</script>
