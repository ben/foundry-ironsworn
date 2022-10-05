<template>
  <div class="pc-condition-meters flexcol">
    <ConditionMeterSpinner
      v-for="resource in ['Health', 'Spirit', 'Supply']"
      orientation="vertical"
      class="nogrow"
      documentType="Actor"
      :attr="resource.toLowerCase()"
      :initial-value="actor?.data[resource.toLowerCase()]"
      :max="5"
      :min="0"
      :buttonLabel="$t(`IRONSWORN.${resource}`)"
      :labelPosition="props.labelPosition"
      :softMax="props.softMax"
    />
  </div>
</template>

<style lang="less">
@meter_spacing: 6px;

.pc-condition-meters {
  gap: @meter_spacing;
  .condition-meter-spinner {
    &:not(:first-child) {
      border-top: 1px solid currentColor;
      padding-top: @meter_spacing;
    }
  }
  button {
    height: max-content;
  }
}
</style>
<script lang="ts" setup>
import { inject, Ref } from 'vue'
import { $ActorKey } from '../../provisions.js'
import ConditionMeterSpinner from './condition-meter-spinner.vue'
import { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'

const props = defineProps<{
  softMax?: number
  labelPosition: 'left' | 'right'
}>()

const actor = inject('actor') as Ref
const $actor = inject($ActorKey)
</script>
