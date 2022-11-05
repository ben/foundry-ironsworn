<template>
  <div :class="$style.assetconditions" v-if="asset.data.conditions?.length > 0">
    <label
      v-for="(condition, i) in asset.data.conditions"
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
  flex-grow: 0;
  flex-direction: column;
  justify-content: space-around;
  margin: 5px;
  height: 100%;
}
.condition {
  font-size: x-small;
  white-space: nowrap;
  line-height: 12px;
  flex-basis: 12px;
  margin: 1px 0;

  input[type='checkbox'] {
    width: 12px;
    height: 12px;
    flex: 0 0 12px;
    margin: 0 3px;
    vertical-align: bottom;
  }
}
</style>

<script lang="ts" setup>
import { inject } from 'vue'
import { $ItemKey } from '../../provisions'

const props = defineProps<{ asset: any }>()

const $item = inject($ItemKey)

function toggleCondition(idx: number) {
  const { conditions } = props.asset.data
  conditions[idx].ticked = !conditions[idx].ticked
  $item?.update({ data: { conditions } })
}
</script>
