<template>
  <div class="flexrow" style="gap: 10px">
    <!-- TABS -->
    <div class="flexcol" style="flex-basis: 10em">
      <div
        v-for="(bond, i) in bonds"
        :key="`bond${i}`"
        class="clickable block nogrow tab flexrow"
        :class="{ selected: selectedBondIndex == i }"
        @click="selectedBondIndex = i"
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
      <div class="flexcol" v-if="selectedBondIndex >= 0">
        <h1 class="nogrow">
          <input v-model="data.currentBondName" type="text" @blur="save" />
        </h1>
        <MceEditor v-model="data.currentBondNotes" :editing="true" />
      </div>
    </div>
  </div>
</template>
<!-- <div class="flexcol">
  <CollapseTransition group>
    <article
      class="item-row nogrow flexrow"
      v-for="(bond, i) in item.system.bonds"
      style="gap: 5px"
      :key="'bond' + i"
    >
      <div class="flexcol" style="gap: 5px">
        <input type="text" v-model="bond.name" @blur="save" />
        <textarea v-model="bond.notes" @blur="save" />
      </div>
      <BtnFaicon class="block nogrow" icon="trash" @click="deleteBond(i)" />
    </article>
  </CollapseTransition>
  <BtnFaicon class="block nogrow" icon="plus" @click="addBond" />
</div> -->

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

const selectedBondIndex = ref(-1)

const data = reactive({
  currentBondName: '',
  currentBondNotes: '',
})
if (bonds.value?.length > 0) {
  selectedBondIndex.value = 0
}

watch(selectedBondIndex, (selectedBondIndex) => {
  console.log(selectedBondIndex)
  if (selectedBondIndex >= 0) {
    data.currentBondName = bonds.value?.[selectedBondIndex]?.name
    data.currentBondNotes = bonds.value?.[selectedBondIndex]?.notes
  }
})

function deleteBond(i) {
  const system = props.item.system as BondsetDataPropertiesData
  const bonds = Object.values(system.bonds)
  bonds.splice(i, 1)
  $item?.update({ system: { bonds } })

  if (selectedBondIndex == i) selectedBondIndex.value = i - 1
}

function addBond() {
  const system = props.item.system as BondsetDataPropertiesData
  const bonds = Object.values(system.bonds)
  bonds.push({ name: '', notes: '' })
  $item?.update({ system: { bonds } })
  selectedBondIndex.value = bonds.length - 1
}

function save() {
  const localBonds = bonds.value
  const currentBond = localBonds[selectedBondIndex.value]
  if (currentBond) {
    currentBond.name = data.currentBondName
    currentBond.notes = data.currentBondNotes
  }
  $item?.update({ system: { bonds: localBonds } })
}
</script>
