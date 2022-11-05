<template>
  <div class="flexcol nogrow" style="margin-top: 1em">
    <CollapseTransition group tag="div">
      <div
        class="form-group nogrow"
        style="gap: 5px"
        v-for="(option, i) in item.data.exclusiveOptions"
        :key="`item${i}`"
      >
        <input
          type="text"
          :placeholder="$t('IRONSWORN.Label')"
          v-model="option.name"
          @blur="save"
        />
        <BtnFaicon icon="trash" @click="deleteOption(i)" />
      </div>
    </CollapseTransition>
    <BtnFaicon icon="plus" class="block" @click="addOption">
      {{ $t('IRONSWORN.Option') }}
    </BtnFaicon>
  </div>
</template>

<script setup lang="ts">
import { inject, nextTick, Ref } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'
import CollapseTransition from '../transition/collapse-transition.vue'
import BtnFaicon from '../buttons/btn-faicon.vue'

const item = inject(ItemKey) as Ref
const $item = inject($ItemKey)

function save() {
  const { exclusiveOptions } = item.value?.data
  $item?.update({ data: { exclusiveOptions } })
}

function deleteOption(idx) {
  const exclusiveOptions = Object.values(
    item.value?.data.exclusiveOptions
  ) as any[]
  const needNewSelection = exclusiveOptions[idx].selected
  exclusiveOptions.splice(idx, 1)
  if (needNewSelection && exclusiveOptions[0]) {
    exclusiveOptions[0].selected = true
  }
  $item?.update({ data: { exclusiveOptions } })
}

async function addOption() {
  const exclusiveOptions = Object.values(
    item.value?.data.exclusiveOptions
  ) as any[]
  exclusiveOptions.push({
    name: '',
    selected: exclusiveOptions.every((x) => !x.selected),
  })
  $item?.update({ data: { exclusiveOptions } })
}
</script>
