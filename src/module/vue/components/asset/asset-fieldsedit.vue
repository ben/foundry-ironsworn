<template>
  <div class="boxgroup">
    <CollapseTransition group tag="div" class="nogrow">
      <div
        class="flexrow boxrow nogrow fieldrow"
        v-for="(field, i) in item.data.fields"
        :key="'field' + i"
      >
        <div class="box flexrow" style="align-items: center">
          <input
            v-if="editMode"
            type="text"
            v-model="field.name"
            @blur="save"
          />
          <p v-else>{{ field.name }}</p>
        </div>
        <div class="box flexrow">
          <input type="text" v-model="field.value" @blur="save" />
        </div>
        <div v-if="editMode" class="box flexrow nogrow">
          <btn-faicon icon="trash" @click="deleteField(i)" />
        </div>
      </div>
    </CollapseTransition>
    <div class="flexrow boxrow nogrow" v-if="editMode">
      <btn-faicon
        icon="plus"
        class="box block"
        @click="addField"
        style="min-height: 1.5rem; align-items: center"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.boxrow {
  align-items: stretch;
  input {
    margin: 2px 5px;
    text-align: left;
  }
}
</style>

<script setup lang="ts">
import { computed, inject, Ref } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'
import BtnFaicon from '../buttons/btn-faicon.vue'
import CollapseTransition from '../transition/collapse-transition.vue'

const item = inject(ItemKey) as Ref
const $item = inject($ItemKey)

const editMode = computed(() => {
  return item.value.flags['foundry-ironsworn']?.['edit-mode']
})

function enterEditMode() {
  $item?.setFlag('foundry-ironsworn', 'edit-mode', true)
}
function addField() {
  enterEditMode()
  const fields = Object.values(item.value.data.fields) as any[]
  fields.push({ name: ' ', value: ' ' })
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
