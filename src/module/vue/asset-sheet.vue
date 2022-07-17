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
      <asset-fieldsedit />
    </div>

    <!-- ABILITIES -->
    <h3>{{ $t('IRONSWORN.Abilities') }}</h3>
    <asset-abilitiesedit />

    <!-- OPTIONS -->
    <div v-if="hasOptions || editMode">
      <h3>{{ $t('IRONSWORN.Options') }}</h3>
      <asset-optionsedit />
    </div>

    <!-- TRACK -->
    <h3>{{ $t('IRONSWORN.Track') }}</h3>
    <asset-trackedit />
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
import { computed, inject, provide, Ref } from 'vue'
import DocumentName from './components/document-name.vue'
import AssetFieldsedit from './components/asset/asset-fieldsedit.vue'
import AssetAbilitiesedit from './components/asset/asset-abilitiesedit.vue'
import AssetOptionsedit from './components/asset/asset-optionsedit.vue'
import AssetTrackedit from './components/asset/asset-trackedit.vue'
import { $ItemKey } from './provisions'

const $item = inject($ItemKey)

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
  $item?.update({ data: { description: props.item.data.description } })
}
</script>
