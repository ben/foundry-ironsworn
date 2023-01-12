<template>
  <div class="flexcol">
    <SheetHeader class="nogrow">
      <DocumentName :document="item" />
    </SheetHeader>
    <TabSet
      v-if="editMode"
      :tabKeys="['description', 'fields', 'abilities', 'options', 'track']"
      :id="`${item._id}-asset-sheet`"
      :class="$style.tabSet"
    >
      <TabList :class="$style.tabList">
        <Tab
          tab-key="description"
          :class="$style.tab"
          :text="$t('IRONSWORN.Description')"
        />
        <Tab
          tab-key="fields"
          :class="$style.tab"
          :text="$t('IRONSWORN.Fields')"
        />
        <Tab
          tab-key="abilities"
          :class="$style.tab"
          :text="$t('IRONSWORN.Abilities')"
        />
        <Tab
          tab-key="options"
          :class="$style.tab"
          :text="$t('IRONSWORN.Options')"
        />
        <Tab
          tab-key="track"
          :class="$style.tab"
          :text="$t('IRONSWORN.Track')"
        />
      </TabList>
      <TabPanels :class="$style.tabPanels">
        <TabPanel
          tab-key="description"
          class="flexcol"
          :class="$style.TabPanel"
        >
          <AssetEditDescription />
        </TabPanel>
        <TabPanel tab-key="fields" class="flexcol" :class="$style.TabPanel">
          <AssetEditFields />
        </TabPanel>
        <TabPanel tab-key="abilities" class="flexcol" :class="$style.TabPanel">
          <AssetEditAbilities />
        </TabPanel>
        <TabPanel tab-key="options" class="flexcol" :class="$style.TabPanel">
          <AssetEditOptions />
        </TabPanel>
        <TabPanel tab-key="track" class="flexcol" :class="$style.TabPanel">
          <AssetEditTrack />
        </TabPanel>
      </TabPanels>
    </TabSet>
    <AssetOverview v-else />
  </div>
</template>

<style lang="scss" module>
.entrygrid {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
</style>

<style lang="scss" scoped>
.fieldrow {
  p,
  input {
    margin: var(--ironsworn-spacer-sm);
    padding: 0 0.5em;
    text-align: left;
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
