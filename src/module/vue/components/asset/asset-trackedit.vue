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
    <asset-track style="margin-top: 5px" :item="item" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, Ref } from 'vue'
import { $ItemKey } from '../../provisions'
import AssetTrack from './asset-track.vue'

const item = inject('item') as Ref
const editMode = computed(() => {
  return item.value.flags['foundry-ironsworn']?.['edit-mode']
})

const $item = inject($ItemKey)
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
