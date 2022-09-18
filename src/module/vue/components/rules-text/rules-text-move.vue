<template>
  <RulesText
    class="rules-text-move"
    :source="move.dataforgedMove?.Source"
    :content="(props.move.moveItem.data as SFMoveDataProperties).data.Text"
    type="markdown"
  >
    <template #before-main>
      <slot name="before-main"></slot>
    </template>
    <template #after-main>
      <slot name="after-main"></slot>
    </template>
    <template #after-footer>
      <slot name="after-footer"></slot>
    </template>
  </RulesText>
</template>

<script setup lang="ts">
import { Move } from '../../../features/custommoves.js'
import { SFMoveDataProperties } from '../../../item/itemtypes.js'

import RulesText from './rules-text.vue'

const props = defineProps<{ move: Move }>()
</script>
