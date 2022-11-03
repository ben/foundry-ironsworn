<template>
  <div>
    <div
      class="flexcol"
      v-for="(ability, i) in item.data.abilities"
      :key="'ability' + i"
    >
      <div class="flexrow">
        <input
          type="checkbox"
          :checked="ability.enabled"
          @change="markAbility(i)"
        />
        <input
          v-if="editMode"
          type="text"
          v-model="ability.description"
          @blur="save"
        />
        <div v-else v-html="$enrichHtml(ability.description)" />

        <clock
          v-if="!editMode && ability.hasClock"
          class="nogrow"
          style="flex-basis: 100px"
          :wedges="ability.clockMax"
          :ticked="ability.clockTicks"
          @click="setClock(i, $event)"
        />
      </div>
      <div class="flexrow" v-if="editMode">
        <label>
          <input
            type="checkbox"
            :checked="ability.hasClock"
            @change="enableClock(i)"
          />
          {{ $t('IRONSWORN.Clock') }}
        </label>
        <select
          class="nogrow"
          v-model="ability.clockMax"
          @change="clockMaxChange(i)"
          style="margin: 0.5rem 0"
        >
          <option value="4">4 segments</option>
          <option value="6">6 segments</option>
          <option value="8">8 segments</option>
          <option value="10">10 segments</option>
          <option value="12">12 segments</option>
        </select>
      </div>
      <hr />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, Ref, inject } from 'vue'
import { AssetDataPropertiesData } from '../../../item/itemtypes'
import { $ItemKey, ItemKey } from '../../provisions'
import Clock from '../clock.vue'

const item = inject(ItemKey) as Ref
const $item = inject($ItemKey)

const editMode = computed(
  () => item.value?.flags['foundry-ironsworn']?.['edit-mode']
)

function markAbility(idx) {
  const data = item.value?.data as AssetDataPropertiesData
  const abilities = Object.values(data.abilities)
  abilities[idx] = { ...abilities[idx], enabled: !abilities[idx].enabled }
  $item?.update({ data: { abilities } })
}

function enableClock(idx) {
  const data = item.value?.data as AssetDataPropertiesData
  const abilities = Object.values(data.abilities)
  abilities[idx] = { ...abilities[idx], hasClock: !abilities[idx].hasClock }
  $item?.update({ data: { abilities } })
}

function clockMaxChange(idx: number) {
  const abilities = Object.values(item.value?.data.abilities) as any[]
  abilities[idx].clockMax = parseInt(abilities[idx].clockMax)
  $item?.update({ data: { abilities } })
}

function setClock(abilityIdx: number, clockTicks: number) {
  const abilities = Object.values(item.value?.data.abilities) as any[]
  abilities[abilityIdx] = { ...abilities[abilityIdx], clockTicks }
  $item?.update({ data: { abilities } })
}

function save() {
  const { abilities } = item.value?.data
  $item?.update({ data: { abilities } })
}
</script>
