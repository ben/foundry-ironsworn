<template>
  <btn-isicon
    @click="rollMove"
    :tooltip="tooltip"
    class="action-roll move-roll"
    icon="d10-tilt"
    aria-haspopup="dialog"
    :disabled="disabled"
  >
    <slot name="default"></slot>
  </btn-isicon>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { SFRollMoveDialog } from '../../../helpers/rolldialog-sf'
import { $ActorKey } from '../../provisions'
import btnIsicon from './btn-isicon.vue'

const props = defineProps<{
  move?: any
  tooltip?: string
  disabled?: boolean
}>()

const $actor = inject($ActorKey)

async function rollMove() {
  if ($actor) SFRollMoveDialog.show($actor, props.move.moveItem)
}
</script>
