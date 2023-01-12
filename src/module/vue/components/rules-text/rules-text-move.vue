<template>
  <RulesText
    class="rules-text-move"
    :source="move.dataforgedMove?.Source"
    :content="content"
    :strip-tables="hasOracles"
    type="markdown"
  >
    <template #before-main>
      <slot name="before-main">
        <i
          :class="$style['progress-move-label']"
          v-if="move.moveItem().isProgressMove()"
          >{{ $t('IRONSWORN.ProgressMove') }}</i
        >
      </slot>
    </template>
    <template #after-main>
      <slot name="after-main"></slot>
    </template>
    <template #after-footer>
      <slot name="after-footer"></slot>
    </template>
  </RulesText>
</template>

<style lang="scss" module>
.progress-move-label {
  opacity: 0.5;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { Move } from '../../../features/custommoves.js'
import { SFMoveDataPropertiesData } from '../../../item/itemtypes.js'

import RulesText from './rules-text.vue'

const props = defineProps<{ move: Move }>()
const content = computed(() => {
  const moveItem = props.move.moveItem()
  const sys = moveItem.system as SFMoveDataPropertiesData
  return sys.Text
})

const hasOracles = computed(
  () => (props.move?.dataforgedMove?.Oracles?.length ?? 0) > 0
)
</script>
