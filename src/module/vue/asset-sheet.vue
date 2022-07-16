<template>
  <div>
    <header class="sheet-header">
      <document-name :document="item" />
    </header>

    <p>
      <input
        v-if="editMode"
        type="text"
        v-model="item.data.description"
        @blur="setDescription"
      />
      <span v-else v-html="$enrichHtml(item.data.description)"></span>
    </p>

    <!-- FIELDS -->
    <div v-if="hasFields || editMode">
      <h3>{{ $t('IRONSWORN.Fields') }}</h3>
      <asset-fieldsedit :item="item" />
    </div>

    <!-- ABILITIES -->
    <h3>{{ $t('IRONSWORN.Abilities') }}</h3>
    <asset-abilitiesedit :item="item" />

    <!-- OPTIONS -->
    <div v-if="hasOptions || editMode">
      <h3>{{ $t('IRONSWORN.Options') }}</h3>
      <asset-optionsedit :item="item" />
    </div>

    <!-- TRACK -->
    <h3>{{ $t('IRONSWORN.Track') }}</h3>
    <asset-trackedit :item="item" />
  </div>
</template>

<style lang="less" scoped>
.fieldrow {
  p,
  input {
    text-align: left;
    padding: 0 0.5em;
    margin: 3px;
  }
}
h3 {
  margin-top: 1em;
}
</style>

<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { IronswornItem } from '../item/item'
import DocumentName from './components/document-name.vue'

const $item = inject('$item') as IronswornItem

const props = defineProps<{ item: any }>()
provide(
  'item',
  computed(() => props.item)
)

const editMode = computed(() => {
  return props.item.flags['foundry-ironsworn']?.['edit-mode']
})

const hasOptions = computed(() => {
  return Object.values(props.item.data.exclusiveOptions || []).length > 0
})

const hasFields = computed(() => {
  return Object.values(props.item.data.fields || []).length > 0
})

function setDescription() {
  $item.update({ data: { description: props.item.data.description } })
}
</script>
