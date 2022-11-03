<template>
  <div class="flexcol stack">
    <div v-if="editMode">
      <CollapseTransition group tag="div">
        <div
          class="stack-row flexrow"
          v-for="(option, i) in item.data.exclusiveOptions"
          :key="'item' + i"
        >
          <input
            type="text"
            v-model="option.name"
            @blur="updateOptionName(i)"
          />
          <btn-faicon icon="trash" @click="deleteOption(i)" />
        </div>
      </CollapseTransition>
      <btn-faicon
        icon="plus"
        class="stack-row block"
        @click="addOption"
        style="min-height: 1.5rem; align-items: center"
      />
    </div>

    <div v-else>
      <asset-exclusiveoption
        v-for="(opt, i) in item.data.exclusiveOptions"
        :key="'option' + i"
        :opt="opt"
        @click="markOption(i)"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.stack-row {
  align-items: stretch;
  input {
    margin: 2px 5px;
  }
}
</style>

<script setup lang="ts">
import { computed, inject, nextTick, Ref } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'
import BtnFaicon from '../buttons/btn-faicon.vue'
import AssetExclusiveoption from './asset-exclusiveoption.vue'
import CollapseTransition from '../transition/collapse-transition.vue'

const item = inject(ItemKey) as Ref
const $item = inject($ItemKey)

const editMode = computed(() => {
  return item.value.flags['foundry-ironsworn']?.['edit-mode']
})
function enterEditMode() {
  $item?.setFlag('foundry-ironsworn', 'edit-mode', true)
}

function markOption(idx) {
  const exclusiveOptions = Object.values(
    item.value?.data.exclusiveOptions
  ) as any[]

  for (let i = 0; i < exclusiveOptions.length; i++) {
    exclusiveOptions[i] = {
      ...exclusiveOptions[i],
      selected: i === idx,
    }
  }
  $item?.update({ data: { exclusiveOptions } })
}

function updateOptionName(idx) {
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
  enterEditMode()
  await nextTick()
  const exclusiveOptions = Object.values(
    item.value?.data.exclusiveOptions
  ) as any[]
  exclusiveOptions.push({
    name: ' ',
    value: ' ',
    selected: exclusiveOptions.every((x) => !x.selected),
  })
  $item?.update({ data: { exclusiveOptions } })
}
</script>
