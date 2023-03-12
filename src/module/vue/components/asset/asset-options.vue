<template>
  <div :class="$style.wrapper" class="stack flexrow">
    <div
      class="clickable block stack-row"
      v-for="(opt, i) in asset.system.exclusiveOptions"
      :class="{ [$style.option]: true, selected: opt.selected }"
      :key="'option' + i"
      @click="exclusiveOptionClick(i)"
    >
      {{ opt.name }}
    </div>
  </div>
</template>

<style lang="scss" module>
.wrapper {
}
.option {
}
</style>

<script lang="ts" setup>
import { ComputedRef, inject } from 'vue'
import { $ItemKey, ItemKey } from 'module/vue/provisions'

const props = withDefaults(
  defineProps<{
    readOnly?: boolean
  }>(),
  {}
)

const $asset = inject($ItemKey)
const asset = inject(ItemKey) as ComputedRef

function exclusiveOptionClick(selectedIdx: number) {
  const { exclusiveOptions } = asset.value.system
  for (let i = 0; i < exclusiveOptions.length; i++) {
    exclusiveOptions[i].selected = i === selectedIdx
  }
  $asset?.update({ system: { exclusiveOptions } })
}
</script>
