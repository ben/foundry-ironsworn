<template>
  <TabSet
    :id="`${(actor as any)._id}_move-sheet`"
    ref="$tabSet"
    :class="$style.moveSheetTabSet"
  >
    <TabList>
      <Tab :is="BtnIsicon" icon="d10-tilt" :index="0">{{
        $t('IRONSWORN.Moves')
      }}</Tab>
      <Tab :is="BtnIsicon" icon="oracle" :index="1">{{
        $t('IRONSWORN.Oracles')
      }}</Tab>
    </TabList>
    <TabPanels :class="$style.moveSheetPanels">
      <TabPanel :index="0" :class="$style.moveSheetPanel">
        <Suspense>
          <sf-movesheetmoves
            :class="$style.panelContent"
            ref="movesTab"
            :toolset="toolset"
          /> </Suspense
      ></TabPanel>
      <TabPanel :index="1" :class="$style.moveSheetPanel">
        <Suspense>
          <sf-movesheetoracles
            :class="$style.panelContent"
            ref="oraclesTab"
            :toolset="toolset"
          /> </Suspense
      ></TabPanel>
    </TabPanels>
  </TabSet>
</template>

<style lang="less" module>
.moveSheetTabSet {
  display: flex;
  flex-flow: column nowrap;
}
.moveSheetPanels {
  flex-grow: 1;
  display: inherit;
  flex-flow: inherit;
  height: 100%;
}
.moveSheetPanel {
  flex-flow: inherit;
  height: inherit;
}
.panelContent {
  height: inherit;
}
</style>

<script lang="ts" setup>
// import Tab from './components/tabs/tab.vue'
// import Tabs from './components/tabs/tabs.vue'
import SfMovesheetmoves from './components/sf-movesheetmoves.vue'
import SfMovesheetoracles from './components/sf-movesheetoracles.vue'
import { computed, provide, ref } from 'vue'
import { CharacterDataProperties } from '../actor/actortypes'
import { ActorKey } from './provisions.js'
import TabSet from './components/tabs-new/tab-set.vue'
import TabList from './components/tabs-new/tab-list.vue'
import Tab from './components/tabs-new/tab.vue'
import TabPanels from './components/tabs-new/tab-panels.vue'
import TabPanel from './components/tabs-new/tab-panel.vue'
import BtnIsicon from './components/buttons/btn-isicon.vue'

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
