<template>
  <div class="flexcol nogrow" style="margin-top: 1em">
    <div class="form-group">
      <label class="flexrow" style="align-items: center">
        <input
          type="checkbox"
          class="nogrow"
          :checked="item.data.track.enabled"
          @change="enableClick"
        />
        <span>{{ $t('IRONSWORN.Enabled') }}</span>
      </label>
    </div>

    <div class="form-group">
      <label>{{ $t('IRONSWORN.Name') }}</label>
      <input type="text" @blur="updateName" v-model="item.data.track.name" />
    </div>

    <div class="form-group">
      <label>{{ $t('IRONSWORN.Max') }}</label>
      <input
        type="number"
        @blur="updateMax"
        v-model.number="item.data.track.max"
      />
    </div>

    <AttrSlider
      style="margin-top: 5px"
      attr="track.current"
      documentType="Item"
      :max="item.data.track.max"
      :currentValue="item.data.track.current"
      sliderStyle="horizontal"
    />

    <hr />

    <h4>{{ $t('IRONSWORN.Conditions') }}</h4>
    <CollapseTransition group tag="div" class="nogrow">
      <div
        class="form-group nogrow"
        v-for="(condition, i) in item.data.conditions"
        :key="`condition${i}`"
      >
        <label>{{ $t('IRONSWORN.Name') }}</label>
        <input type="text" @blur="saveConditions" v-model="condition.name" />
        <BtnFaicon icon="trash" @click="deleteCondition(i)" />
      </div>
    </CollapseTransition>
    <BtnFaicon icon="plus" class="button block" @click="addCondition">
      {{ $t('IRONSWORN.Condition') }}
    </BtnFaicon>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, Ref } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'
import CollapseTransition from '../transition/collapse-transition.vue'
import AttrSlider from '../resource-meter/attr-slider.vue'
import BtnFaicon from '../buttons/btn-faicon.vue'

const item = inject(ItemKey) as Ref
const $item = inject($ItemKey)

const editMode = computed(() => {
  return item.value.flags['foundry-ironsworn']?.['edit-mode']
})

function enableClick(ev) {
  $item?.update({ 'data.track.enabled': ev.target.checked })
}

function updateName() {
  $item?.update({ 'data.track.name': item.value.data.track.name })
}

function updateMax() {
  $item?.update({ 'data.track.max': item.value.data.track.max })
}

function saveConditions() {
  $item?.update({ 'data.conditions': item.value.data.conditions })
}

function deleteCondition(idx: number) {
  const { conditions } = item.value.data
  conditions.splice(idx, 1)
  $item?.update({ data: { conditions } })
}

function addCondition() {
  const { conditions } = item.value.data
  conditions.push({ name: '', ticked: false })
  $item?.update({ data: { conditions } })
}
</script>
