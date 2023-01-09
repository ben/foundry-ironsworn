<template>
  <div
    :class="$style.assetconditions"
    v-if="asset.system.conditions?.length > 0"
  >
    <label
      v-for="(condition, i) in asset.system.conditions"
      :key="condition.name"
      :class="$style.condition"
    >
      <input
        type="checkbox"
        :checked="condition.ticked"
        @change="toggleCondition(i)"
      />
      {{ condition.name }}
    </label>
  </div>
</template>

<style lang="less" module>
.assetconditions {
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  justify-content: space-around;
  margin: var(--ironsworn-spacer-md);
}
.condition {
  flex-basis: 12px;
  margin: 1px 0;
  line-height: 12px;
  white-space: nowrap;
  font-size: x-small;

  input[type='checkbox'] {
    flex: 0 0 12px;
    margin: 0 3px;
    width: 12px;
    height: 12px;
    vertical-align: bottom;
  }
}
</style>

<script lang="ts" setup>
import { inject } from 'vue'
import { $ItemKey } from '../../provisions'

const props = defineProps<{ asset: any }>()

const $item = inject($ItemKey)

async function toggleCondition(idx: number) {
  const { conditions } = props.asset.system
  conditions[idx].ticked = !conditions[idx].ticked
  await $item?.update({ system: { conditions } })

  CONFIG.IRONSWORN.emitter.emit('globalConditionChanged', {
    name: conditions[idx].name.toLowerCase(),
    enabled: conditions[idx].ticked,
  })
}
</script>
