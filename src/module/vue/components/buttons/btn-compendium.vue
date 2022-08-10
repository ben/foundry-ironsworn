<template>
  <btn-faicon
    class="btn-compendium"
    icon="atlas"
    @click="openCompendium"
    aria-haspopup="dialog"
    :disabled="disabled"
  >
    <slot name="default"></slot>
  </btn-faicon>
</template>

<script lang="ts" setup>
import BtnFaicon from './btn-faicon.vue'

const props = defineProps<{ compendium: string; disabled?: boolean }>()

async function openCompendium() {
  const pack = game.packs?.get(`foundry-ironsworn.${props.compendium}`)
  pack?.render(true)
}
</script>
