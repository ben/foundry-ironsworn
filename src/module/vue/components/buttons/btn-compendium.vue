<template>
  <btn-faicon
    class="btn-compendium"
    icon="atlas"
    @click="openCompendium"
    aria-haspopup="dialog"
    :disabled="disabled"
    v-bind="props"
  >
    <slot name="default"></slot>
  </btn-faicon>
</template>

<script lang="ts" setup>
import BtnFaicon from './btn-faicon.vue'

const props = defineProps<{
  compendium: string
  // FIXME: shared props, inherit them once Vue adds support in 3.3
  tooltip?: string
  disabled?: boolean
  buttonStyle?: 'noBg' | 'block' | 'blockBorder'
  hoverBg?: boolean
}>()

async function openCompendium() {
  const pack = game.packs?.get(`foundry-ironsworn.${props.compendium}`)
  pack?.render(true)
}
</script>
