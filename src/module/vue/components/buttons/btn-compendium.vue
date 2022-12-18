<template>
  <IronBtn
    class="btn-compendium"
    @click="openCompendium"
    aria-haspopup="dialog"
    :disabled="disabled"
  >
    <template #icon>
      <FontIcon name="book-atlas" />
    </template>
    <slot name="default"></slot>
  </IronBtn>
</template>

<script lang="ts" setup>
import FontIcon from '../icon/font-icon.vue'
import IronBtn from './iron-btn.vue'

const props = defineProps<{ compendium: string; disabled?: boolean }>()

async function openCompendium() {
  const pack = game.packs?.get(`foundry-ironsworn.${props.compendium}`)
  pack?.render(true)
}
</script>
