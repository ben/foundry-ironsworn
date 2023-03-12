<template>
  <div :class="$style.wrapper">
    <label :class="$style.label">{{ field.name }}</label>
    <input
      :class="$style.value"
      type="text"
      v-model="field.value"
      @blur="saveFields"
      :readonly="readonly"
    />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  gap: var(--ironsworn-spacer-sm);
  border-bottom-width: var(--ironsworn-border-width-md);
  border-bottom-style: solid;
  border-bottom-color: var(--ironsworn-color-thematic);
}
.label {
  margin: 0;
  padding: 0;
}
.value {
  flex-grow: 1;
  margin: 0;
  padding: 0 var(--ironsworn-spacer-sm);
}
</style>

<script lang="ts" setup>
import { $ItemKey, ItemKey } from '../../../../module/vue/provisions'
import { ComputedRef, inject } from 'vue'

defineProps<{
  field: { name: string; value: string }
  readonly?: boolean
}>()

const $asset = inject($ItemKey)
const asset = inject(ItemKey) as ComputedRef

function saveFields() {
  const fields = asset.value?.system.fields
  $asset?.update({ system: { fields } })
}
</script>
