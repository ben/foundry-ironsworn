<template>
  <button
    type="button"
    class="box flexrow clickable block"
    :class="{ disabled }"
    @click="click"
  >
    <h4 class="nogrow" style="margin: 0; white-space: nowrap">
      {{ $t(i18nKey) }}
    </h4>
  </button>
</template>

<script setup lang="ts">
import { computed, inject, Ref } from 'vue'
import { moveDataByName } from '../../../helpers/data'
import { RollDialog } from '../../../helpers/rolldialog'
import { $ActorKey } from '../../provisions'
const props = defineProps<{
  movename: string
  disabled?: boolean
}>()

const $actor = inject($ActorKey)

const i18nKey = computed(() => `IRONSWORN.MoveContents.${props.movename}.title`)

async function click() {
  if (props.disabled) return
  const move = await moveDataByName(props.movename)
  RollDialog.show({ move, site: $actor })
}
</script>
