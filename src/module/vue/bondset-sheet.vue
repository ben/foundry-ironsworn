<template>
  <div class="flexcol">
    <transition-group name="slide" tag="div" class="nogrow">
      <div
        class="item-row nogrow flexrow"
        v-for="(bond, i) in item.data.bonds"
        style="gap: 5px"
        :key="'bond' + i"
      >
        <div class="flexcol" style="gap: 5px">
          <input type="text" v-model="bond.name" @blur="save" />
          <textarea v-model="bond.notes" @blur="save" />
        </div>
        <BtnFaicon class="block nogrow" icon="trash" @click="deleteBond(i)" />
      </div>
    </transition-group>

    <BtnFaicon class="block nogrow" icon="plus" @click="addBond" />
  </div>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  max-height: 93px;
}
</style>

<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { $ItemKey, ItemKey } from './provisions'
import BtnFaicon from '../vue/components/buttons/btn-faicon.vue'
import { BondsetDataPropertiesData } from '../item/itemtypes'

const props = defineProps<{ item: any }>()
provide(ItemKey, computed(() => props.item) as any)

const $item = inject($ItemKey)

function deleteBond(i) {
  const data = props.item.data as BondsetDataPropertiesData
  const bonds = Object.values(data.bonds)
  bonds.splice(i, 1)
  $item?.update({ data: { bonds } })
}

function addBond() {
  const data = props.item.data as BondsetDataPropertiesData
  const bonds = Object.values(data.bonds)
  bonds.push({ name: '', notes: '' })
  $item?.update({ data: { bonds } })
}

function save() {
  const data = props.item.data as BondsetDataPropertiesData
  const bonds = Object.values(data.bonds)
  $item?.update({ data: { bonds } })
}
</script>
