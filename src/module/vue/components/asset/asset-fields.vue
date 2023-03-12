<template>
  <div :class="$style.wrapper" class="form-group">
    <div
      v-for="(field, i) in asset.system.fields"
      :class="$style.field"
      :key="`field${i}`"
    >
      <label :class="$style.fieldLabel">{{ field.name }}</label>
      <input
        :class="$style.fieldValue"
        type="text"
        v-model="field.value"
        @blur="saveFields"
        :readonly="readonly"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  margin: 0;
}

.field {
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  gap: var(--ironsworn-spacer-sm);
  border-bottom-width: var(--ironsworn-border-width-md);
  border-bottom-style: solid;
  border-bottom-color: var(--ironsworn-color-thematic);
}

.fieldLabel {
  margin: 0;
  padding: 0;
}

.fieldValue {
  flex-grow: 1;
  margin: 0;
  padding: 0 var(--ironsworn-spacer-sm);
}
</style>

<script lang="ts" setup>
import { $ItemKey, ItemKey } from 'module/vue/provisions'
import { ComputedRef, inject } from 'vue'

withDefaults(defineProps<{ readonly?: boolean }>(), {
  readonly: false,
})

const $asset = inject($ItemKey)
const asset = inject(ItemKey) as ComputedRef

function saveFields() {
  const fields = asset.value?.system.fields
  $asset?.update({ system: { fields } })
}
</script>
