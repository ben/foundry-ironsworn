<template>
  <div>
    <div class="flexrow" style="align-items: center">
      <label class="flexrow" style="align-items: center">
        <input
          type="checkbox"
          class="nogrow"
          :checked="item.data.track.enabled"
          @change="enableClick"
        />
        <span>{{ $t('IRONSWORN.Enabled') }}</span>
      </label>

      <span style="flex-grow: 0; margin: 0 5px">{{
        $t('IRONSWORN.Name')
      }}</span>
      <input type="text" @blur="updateName" v-model="item.data.track.name" />

      <span style="flex-grow: 0; margin: 0 5px">{{ $t('IRONSWORN.Max') }}</span>
      <input
        type="number"
        @blur="updateMax"
        v-model.number="item.data.track.max"
      />
    </div>
    <AttrSlider
      style="margin-top: 5px"
      attr="track"
      documentType="Item"
      :max="item.data.track.max"
      :currentValue="item.data.track.current"
      sliderStyle="horizontal"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, Ref } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'
import AttrSlider from '../resource-meter/attr-slider.vue'

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
</script>
