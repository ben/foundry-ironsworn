<template>
  <div class="flexrow" style="gap: 10px">
    <!-- TABS -->
    <div class="flexcol" style="flex-basis: 10em">
      <div
        v-for="(bond, i) in bonds"
        :key="`bond${i}`"
        class="clickable block nogrow tab flexrow"
        :class="{ selected: data.selectedBondIndex == i }"
        @click="selectBondIndex(i)"
      >
        <span>{{ i + 1 }}. {{ bond.name }}</span>
        <BtnFaicon class="nogrow block" icon="trash" @click="deleteBond(i)" />
      </div>

      <BtnFaicon
        class="block nogrow"
        icon="plus"
        style="flex: 0; width: 100%"
        @click="addBond"
      />
    </div>

    <!-- EDITORS -->
    <div class="flexcol" style="flex-basis: 25em">
      <div class="flexcol" v-if="data.selectedBondIndex >= 0">
        <h1 class="nogrow">
          <input v-model="data.currentBondName" type="text" @blur="save" />
        </h1>
        <MceEditor
          v-model="data.currentBondNotes"
          :editing="true"
          @save="save"
        />
      </div>

      <div v-else>(no bond selected)</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.clickable.block {
  border-style: none;
  line-height: 25px;
  padding: 5px;
  .selected & {
    color: var(--ironsworn-color-clickable-block-fg-selected);
    &:hover {
      color: var(--ironsworn-color-midtone-50);
    }
  }
}
</style>

<script setup lang="ts">
import { computed, inject, provide, reactive, watch, ref } from 'vue'
import { $ItemKey, ItemKey } from './provisions'
import { BondsetDataPropertiesData } from '../item/itemtypes'
import BtnFaicon from '../vue/components/buttons/btn-faicon.vue'
import MceEditor from './components/mce-editor.vue'

const props = defineProps<{ item: any }>()
provide(ItemKey, computed(() => props.item) as any)

const $item = inject($ItemKey)

const bonds = computed(
  () => (props.item.system as BondsetDataPropertiesData).bonds
)

const data = reactive({
  selectedBondIndex: -1,
  currentBondName: '',
  currentBondNotes: '',
})
if (bonds.value?.length > 0) {
  console.log('setting to 0')
  data.selectedBondIndex = 0
}
watch(data, (...args) => {
  console.log(args)
})

function selectBondIndex(i: number) {
  console.log(`Selecting bond index ${i}`)
  data.selectedBondIndex = i
  if (i >= 0) {
    data.currentBondName = bonds.value?.[i]?.name
    data.currentBondNotes = bonds.value?.[i]?.notes
  }
}

async function deleteBond(i) {
  const system = props.item.system as BondsetDataPropertiesData
  const bonds = Object.values(system.bonds)
  bonds.splice(i, 1)
  await $item?.update({ system: { bonds } })

  if (data.selectedBondIndex == i) selectBondIndex(i - 1)
}

async function addBond() {
  const system = props.item.system as BondsetDataPropertiesData
  const bonds = Object.values(system.bonds)
  bonds.push({ name: '', notes: '' })
  await $item?.update({ system: { bonds } })
  selectBondIndex(bonds.length - 1)
}

function save() {
  const localBonds = bonds.value
  const currentBond = localBonds[data.selectedBondIndex]
  if (currentBond) {
    currentBond.name = data.currentBondName
    currentBond.notes = data.currentBondNotes
  }
  $item?.update({ system: { bonds: localBonds } })
}
</script>
