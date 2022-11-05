<template>
  <div class="flexcol nogrow" style="margin-top: 1em">
    <CollapseTransition group tag="div" class="nogrow">
      <div
        class="form-group nogrow"
        style="gap: 5px"
        v-for="(field, i) in item.data.fields"
        :key="`field${i}`"
      >
        <input
          type="text"
          :placeholder="$t('IRONSWORN.Name')"
          v-model="field.name"
          @blur="save"
        />
        <input
          type="text"
          :placeholder="$t('IRONSWORN.Value')"
          v-model="field.value"
          @blur="save"
        />
        <BtnFaicon icon="trash" @click="deleteField(i)" />
      </div>
    </CollapseTransition>
    <BtnFaicon icon="plus" class="button block" @click="addField">
      {{ $t('IRONSWORN.Field') }}
    </BtnFaicon>
  </div>
</template>

<script setup lang="ts">
import { inject, Ref } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'
import BtnFaicon from '../buttons/btn-faicon.vue'
import CollapseTransition from '../transition/collapse-transition.vue'

const item = inject(ItemKey) as Ref
const $item = inject($ItemKey)

function addField() {
  const fields = Object.values(item.value.data.fields) as any[]
  fields.push({ name: '', value: '' })
  $item?.update({ data: { fields } })
}
function deleteField(idx) {
  const fields = Object.values(item.value.data.fields) as any[]
  fields.splice(idx, 1)
  $item?.update({ data: { fields } })
}
function save() {
  const fields = Object.values(item.value.data.fields) as any[]
  $item?.update({ data: { fields } })
}
</script>
