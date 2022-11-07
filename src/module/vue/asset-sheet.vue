<template>
  <div class="flexcol">
    <SheetHeader class="nogrow">
      <DocumentName :document="item" />
    </SheetHeader>

    <Tabs v-if="editMode">
      <Tab :title="$t('IRONSWORN.Description')">
        <AssetEditDescription />
      </Tab>

      <Tab :title="$t('IRONSWORN.Fields')">
        <AssetEditFields />
      </Tab>

      <Tab :title="$t('IRONSWORN.Abilities')">
        <AssetEditAbilities />
      </Tab>

      <Tab :title="$t('IRONSWORN.Options')">
        <AssetEditOptions />
      </Tab>

      <Tab :title="$t('IRONSWORN.Track')">
        <AssetEditTrack />
      </Tab>
    </Tabs>

    <AssetOverview v-else />
  </div>
</template>

<style lang="less" module>
.entrygrid {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
</style>

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
import SheetHeader from './sheet-header.vue'
import DocumentName from './components/document-name.vue'
import Tabs from './components/tabs/tabs.vue'
import Tab from './components/tabs/tab.vue'
import AssetEditDescription from './components/asset/asset-edit-description.vue'
import AssetEditFields from './components/asset/asset-edit-fields.vue'
import AssetEditAbilities from './components/asset/asset-edit-abilities.vue'
import AssetEditOptions from './components/asset/asset-edit-options.vue'
import AssetOverview from './components/asset/asset-overview.vue'
import AssetEditTrack from './components/asset/asset-edit-track.vue'
import { $ItemKey, ItemKey } from './provisions'

const $item = inject($ItemKey)

const props = defineProps<{ item: any }>()
provide(ItemKey, computed(() => props.item) as any)

const editMode = computed(() => {
  return props.item.flags['foundry-ironsworn']?.['edit-mode']
})

const hasOptions = computed(() => {
  return Object.values(props.item.data.exclusiveOptions || []).length > 0
})

const hasFields = computed(() => {
  return Object.values(props.item.data.fields || []).length > 0
})

function setRequirement() {
  $item?.update({ data: { requirement: props.item.data.requirement } })
}
</script>
