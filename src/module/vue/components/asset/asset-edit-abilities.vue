<template>
  <div class="flexcol nogrow" style="margin-top: 1em">
    <CollapseTransition group tag="div" class="nogrow">
      <div
        class="flexcol nogrow"
        v-for="(ability, i) in item.data.abilities"
        :key="`ability${i}`"
      >
        <textarea
          rows="5"
          style="min-height: 90px"
          v-model="ability.description"
          @blur="save"
        ></textarea>
        <div class="flexrow">
          <div class="form-group">
            <label class="flexrow">
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
          <div class="form-group" style="justify-content: right">
            <BtnFaicon
              icon="trash"
              class="button block nogrow"
              :class="{ disabled: item.data.abilities.length < 2 }"
              @click="deleteAbility(i)"
            />
          </div>
        </div>

        <hr />
      </div>
    </CollapseTransition>
    <BtnFaicon icon="plus" class="button block" @click="addAbility">
      {{ $t('IRONSWORN.Ability') }}
    </BtnFaicon>
  </div>
</template>

<script setup lang="ts">
import { computed, Ref, inject, onUnmounted } from 'vue'
import { AssetDataPropertiesData } from '../../../item/itemtypes'
import { $ItemKey, ItemKey } from '../../provisions'
import CollapseTransition from '../transition/collapse-transition.vue'
import Clock from '../clock.vue'
import BtnFaicon from '../buttons/btn-faicon.vue'

const item = inject(ItemKey) as Ref
const $item = inject($ItemKey)

const editMode = computed(
  () => item.value?.flags['foundry-ironsworn']?.['edit-mode']
)

function deleteAbility(idx: number) {
  const data = item.value?.data as AssetDataPropertiesData
  const abilities = Object.values(data.abilities)
  abilities.splice(idx, 1)
  $item?.update({ data: { abilities } })
}

function addAbility() {
  const data = item.value?.data as AssetDataPropertiesData
  const abilities = Object.values(data.abilities)
  abilities.push({
    description: '',
    enabled: false,
    hasClock: false,
    clockMax: 4,
    clockTicks: 0,
  })
  $item?.update({ data: { abilities } })
}

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
