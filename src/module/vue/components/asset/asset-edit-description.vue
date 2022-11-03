<template>
  <div class="form-group nogrow">
    <label style="grid-column: 1; grid-row: 1">
      {{ $t('IRONSWORN.Category') }}
    </label>
    <input
      style="grid-row: 1; grid-column: 2"
      type="text"
      v-model="item.data.category"
      @blur="setCategory"
    />
  </div>

  <div class="form-group nogrow">
    <label>{{ $t('IRONSWORN.Color') }}</label>
    <input type="color" v-model="item.data.color" @change="setColor" />
  </div>

  <hr class="nogrow" />
  <MceEditor
    v-model="item.data.description"
    @save="setDescription"
    :editing="true"
    style="flex: 1; height: 100%"
  />
</template>

<script lang="ts" setup>
import MceEditor from '../mce-editor.vue'
import DocumentName from '../document-name.vue'

import { computed, ComputedRef, inject } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'
import { AssetDataPropertiesData } from '../../../item/itemtypes'

const $item = inject($ItemKey)
const item = inject(ItemKey) as ComputedRef<any>

function setDescription() {
  if (!item.value) return
  $item?.update({ data: { description: item.value.data.description } })
}
function setCategory() {
  if (!item.value) return
  $item?.update({ data: { category: item.value.data.category } })
}
function setColor() {
  if (!item.value) return
  $item?.update({ data: { color: item.value.data.color } })
}
</script>
