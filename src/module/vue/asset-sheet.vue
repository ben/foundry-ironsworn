<template>
  <div class="flexcol">
    <SheetHeader class="nogrow">
      <DocumentName :document="item" />
    </SheetHeader>
    <TabSet
      v-if="editMode"
      :id="`${item._id}-asset-sheet`"
      :class="$style.tabSet"
    >
      <TabList :class="$style.tabList">
        <Tab :index="0" :class="$style.tab">
          {{ $t('IRONSWORN.Description') }}
        </Tab>

        <Tab :index="1" :class="$style.tab">
          {{ $t('IRONSWORN.Fields') }}
        </Tab>

        <Tab :index="2" :class="$style.tab">
          {{ $t('IRONSWORN.Abilities') }}
        </Tab>

        <Tab :index="3" :class="$style.tab">
          {{ $t('IRONSWORN.Options') }}
        </Tab>

        <Tab :index="4" :class="$style.tab">
          {{ $t('IRONSWORN.Track') }}
        </Tab>
      </TabList>
      <TabPanels :class="$style.tabPanels">
        <TabPanel :index="0" class="flexcol" :class="$style.TabPanel">
          <AssetEditDescription
        /></TabPanel>
        <TabPanel :index="1" class="flexcol" :class="$style.TabPanel">
          <AssetEditFields
        /></TabPanel>
        <TabPanel :index="2" class="flexcol" :class="$style.TabPanel">
          <AssetEditAbilities
        /></TabPanel>
        <TabPanel :index="3" class="flexcol" :class="$style.TabPanel">
          <AssetEditOptions
        /></TabPanel>
        <TabPanel :index="4" class="flexcol" :class="$style.TabPanel">
          <AssetEditTrack
        /></TabPanel>
      </TabPanels>
    </TabSet>
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
import { computed, inject, provide } from 'vue'
import SheetHeader from './sheet-header.vue'
import DocumentName from './components/document-name.vue'
import AssetEditDescription from './components/asset/asset-edit-description.vue'
import AssetEditFields from './components/asset/asset-edit-fields.vue'
import AssetEditAbilities from './components/asset/asset-edit-abilities.vue'
import AssetEditOptions from './components/asset/asset-edit-options.vue'
import AssetOverview from './components/asset/asset-overview.vue'
import AssetEditTrack from './components/asset/asset-edit-track.vue'
import { $ItemKey, ItemKey } from './provisions'
import TabSet from './components/tabs/tab-set.vue'
import TabList from './components/tabs/tab-list.vue'
import TabPanels from './components/tabs/tab-panels.vue'
import TabPanel from './components/tabs/tab-panel.vue'
import Tab from './components/tabs/tab.vue'

const $item = inject($ItemKey)

const props = defineProps<{ item: any }>()
provide(ItemKey, computed(() => props.item) as any)

const editMode = computed(() => {
  return props.item.flags['foundry-ironsworn']?.['edit-mode']
})

const hasOptions = computed(() => {
  return Object.values(props.item.system.exclusiveOptions || []).length > 0
})

const hasFields = computed(() => {
  return Object.values(props.item.system.fields || []).length > 0
})

function setRequirement() {
  $item?.update({ system: { requirement: props.item.system.requirement } })
}
</script>
