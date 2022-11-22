<template>
  <component
    :is="componentClass"
    :icon="buttonIcon"
    @click="rollMove"
    :tooltip="
      $t('IRONSWORN.RollMove', {
        title: move?.displayName,
      })
    "
    class="box block action-roll move-roll"
    aria-haspopup="dialog"
    :disabled="disabled"
  >
    {{ move?.displayName }}
  </component>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { createSfMoveChatMessage } from '../../../chat/sf-move-chat-message'
import { Move } from '../../../features/custommoves'
import { IronswornPrerollDialog } from '../../../rolls'
import { moveHasRollableOptions } from '../../../rolls/preroll-dialog'
import { $ActorKey } from '../../provisions'
import BtnIsicon from '../buttons/btn-isicon.vue'
import BtnFaIcon from '../buttons/btn-faicon.vue'

const $actor = inject($ActorKey)

const props = defineProps<{ move?: Move; disabled?: boolean }>()

const componentClass = computed(() => {
  const item = props.move?.moveItem?.()
  if (item && moveHasRollableOptions(item)) {
    return BtnIsicon
  }
  return BtnFaIcon
})

const buttonIcon = computed(() => {
  const item = props.move?.moveItem?.()
  if (item && moveHasRollableOptions(item)) {
    return 'd10-tilt'
  }
  return 'comment'
})

async function rollMove() {
  if (!props.move) throw new Error('No move?')

  if (!moveHasRollableOptions(props.move.moveItem())) {
    return createSfMoveChatMessage(props.move.moveItem())
  }

  if (props.move.dataforgedMove)
    return IronswornPrerollDialog.showForOfficialMove(
      props.move?.dataforgedMove.$id,
      $actor
    )
  IronswornPrerollDialog.showForMove(props.move.moveItem(), $actor)
}
</script>
