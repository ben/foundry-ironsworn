<template>
  <btn-faicon
    class="move-chat"
    icon="comment"
    :tooltip="tooltip"
    @click="sendToChat"
    :disabled="disabled"
    ><slot name="default"><!-- {{$t('IRONSWORN.Chat')}} --></slot></btn-faicon
  >
</template>

<style lang="less"></style>

<script setup lang="ts">
import { Move } from '../../../features/custommoves'
import btnFaicon from './btn-faicon.vue'

const props = defineProps<{
  move: Move
  tooltip?: string
  disabled?: boolean
}>()

function sendToChat(e) {
  CONFIG.IRONSWORN.SFRollMoveDialog.createDataforgedMoveChat(
    props.move.moveItem
  )
}
</script>
