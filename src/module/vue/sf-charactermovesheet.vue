<template>
  <!-- <Tabs ref="tabs">
    <tab icon="isicon-d10-tilt" :title="$t('IRONSWORN.Moves')">
      <Suspense>
        <sf-movesheetmoves ref="movesTab" :toolset="toolset" />
      </Suspense>
    </tab>
    <tab icon="isicon-oracle" :title="$t('IRONSWORN.Oracles')">
      <Suspense>
        <sf-movesheetoracles ref="oraclesTab" :toolset="toolset" />
      </Suspense>
    </tab>
  </Tabs> -->
  <TabSet :id="`${(actor as any)._id}_move-sheet`" ref="$tabSet">
    <TabList>
      <Tab :is="BtnIsicon" icon="d10-tilt" :index="0">{{
        $t('IRONSWORN.Moves')
      }}</Tab>
      <Tab :is="BtnIsicon" icon="oracle" :index="1">{{
        $t('IRONSWORN.Oracles')
      }}</Tab>
    </TabList>
    <TabPanels>
      <TabPanel :index="0">
        <Suspense>
          <sf-movesheetmoves ref="movesTab" :toolset="toolset" /> </Suspense
      ></TabPanel>
      <TabPanel :index="1">
        <Suspense>
          <sf-movesheetoracles ref="oraclesTab" :toolset="toolset" /> </Suspense
      ></TabPanel>
    </TabPanels>
  </TabSet>
</template>

<script lang="ts" setup>
// import Tab from './components/tabs/tab.vue'
// import Tabs from './components/tabs/tabs.vue'
import SfMovesheetmoves from './components/sf-movesheetmoves.vue'
import SfMovesheetoracles from './components/sf-movesheetoracles.vue'
import { computed, provide, ref } from 'vue'
import { CharacterDataProperties } from '../actor/actortypes'
import { ActorKey } from './provisions.js'
import TabSet from './components/tabs-new/tab-set.vue.js'
import TabList from './components/tabs-new/tab-list.vue.js'
import Tab from './components/tabs-new/tab.vue.js'
import TabPanels from './components/tabs-new/tab-panels.vue.js'
import TabPanel from './components/tabs-new/tab-panel.vue.js'
import BtnIsicon from './components/buttons/btn-isicon.vue.js'

const props = defineProps<{
  actor: CharacterDataProperties
  toolset: 'ironsworn' | 'starforged'
}>()

provide(ActorKey, computed(() => props.actor) as any)

const $tabSet = ref<InstanceType<typeof TabSet>>()
const movesTab = ref<InstanceType<typeof SfMovesheetmoves>>()
CONFIG.IRONSWORN.emitter.on('highlightMove', () =>
  $tabSet.value?.setActiveTab(0)
)

const oraclesTab = ref<InstanceType<typeof SfMovesheetoracles>>()
CONFIG.IRONSWORN.emitter.on('highlightOracle', () =>
  $tabSet.value?.setActiveTab(1)
)
</script>
