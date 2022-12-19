<template>
  <div class="flexrow" style="gap: var(--ironsworn-spacer-xl)">
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
        <IronBtn block nogrow @click="deleteBond(i)" icon="fa:trash" />
      </div>
      <IronBtn
        block
        nogrow
        style="flex: 0; width: 100%"
        @click="addBond"
        icon="fa:plus"
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

      <div v-else class="flexcol">
        <h1 class="flexrow no-bonds">{{ $t('IRONSWORN.NoBonds') }}</h1>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.clickable.block {
  border-style: none;
  line-height: 25px;
  padding: var(--ironsworn-spacer-md);
  .selected & {
    color: var(--ironsworn-color-clickable-block-fg-selected);
    &:hover {
      color: var(--ironsworn-color-midtone-50);
    }
  }
}

.no-bonds {
  flex: 1;
  justify-content: center;
  align-content: center;
  background-color: var(--ironsworn-color-input-bg);
}
</style>

<script setup lang="ts">
import { computed, inject, provide, reactive, watch, ref } from 'vue'
import { $ItemKey, ItemKey } from './provisions'
import { BondsetDataPropertiesData } from '../item/itemtypes'
import MceEditor from './components/mce-editor.vue'
import IronBtn from './components/buttons/iron-btn.vue'

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
  selectBondIndex(0)
}

function selectBondIndex(i: number) {
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

  if (data.selectedBondIndex == i) {
    i--
    if (bonds.length > 0 && i < 0) i = 0
    selectBondIndex(i)
  }
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
