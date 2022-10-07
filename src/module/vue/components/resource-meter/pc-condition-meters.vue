<template>
  <div class="condition-meters flexcol">
    <ConditionMeterSlider
      v-for="resource in ['Health', 'Spirit', 'Supply']"
      :key="resource"
      sliderStyle="vertical"
      class="nogrow"
      documentType="Actor"
      :global="resource === 'Supply' && IronswornSettings.globalSupply"
      :attr="resource.toLowerCase()"
      :current-value="actor?.data[resource.toLowerCase()]"
      :max="5"
      :min="0"
      :statLabel="$t(`IRONSWORN.${resource}`)"
      :labelPosition="props.labelPosition"
    />
  </div>
</template>

<style lang="less">
@meter_spacing: 6px;

.condition-meters {
  gap: @meter_spacing;
  .condition-meter {
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
import { computed, inject } from 'vue'
import { ActorKey } from '../../provisions.js'
import ConditionMeterSlider from './condition-meter.vue'
import { IronswornSettings } from '../../../helpers/settings.js'

const props = defineProps<{
  labelPosition: 'left' | 'right'
}>()

const actor = inject(ActorKey)
</script>
