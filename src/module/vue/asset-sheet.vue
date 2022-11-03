<template>
  <div class="flexcol">
    <SheetHeader class="nogrow">
      <document-name :document="item" />
    </SheetHeader>

    <Tabs v-if="editMode">
      <Tab :title="$t('IRONSWORN.Description')">
        <AssetDescriptionEdit />
      </Tab>

      <Tab :title="$t('IRONSWORN.Fields')">
        <AssetFieldsedit />
      </Tab>

      <Tab :title="$t('IRONSWORN.Abilities')">
        <AssetAbilitiesedit />
      </Tab>

      <Tab :title="$t('IRONSWORN.Options')">
        <AssetOptionsedit />
      </Tab>

      <Tab :title="$t('IRONSWORN.Track')">
        <AssetTrackedit />
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
import Tabs from './components/tabs/tabs.vue'
import Tab from './components/tabs/tab.vue'
import AssetDescriptionEdit from './components/asset/asset-description-edit.vue'
import AssetFieldsedit from './components/asset/asset-fieldsedit.vue'
import AssetAbilitiesedit from './components/asset/asset-abilitiesedit.vue'
import AssetOptionsedit from './components/asset/asset-optionsedit.vue'
import AssetOverview from './components/asset/asset-overview.vue'
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
