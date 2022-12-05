<template>
  <SheetBasic
    :document="actor"
    class="character-sheet-classic"
    bodyClass="flexrow"
  >
    <!-- Header row -->
    <template #header>
      <CharacterHeader />
    </template>

    <!-- Main body row -->
    <!-- Momentum on left -->
    <div class="flexcol margin-left">
      <MomentumMeterSlider labelPosition="right" data-tooltip-direction="UP" />
    </div>

    <!-- Center area -->
    <div class="flexcol">
      <!-- Attributes -->
      <div class="flexrow stats" data-tooltip-direction="UP">
        <attr-box attr="edge"></attr-box>
        <attr-box attr="heart"></attr-box>
        <attr-box attr="iron"></attr-box>
        <attr-box attr="shadow"></attr-box>
        <attr-box attr="wits"></attr-box>
      </div>
      <TabSet
        :id="`${actor._id}-character-sheet-classic`"
        :class="$style.tabSet"
      >
        <TabList
          ><Tab :index="0">{{ $t('IRONSWORN.Character') }}</Tab
          ><Tab :index="1">{{ $t('IRONSWORN.Notes') }}</Tab></TabList
        >
        <TabPanels>
          <TabPanel :index="0">
            <IronswornMain />
          </TabPanel>
          <TabPanel :index="1">
            <IronswornNotes :class="$style.tabContent" />
          </TabPanel>
        </TabPanels>
      </TabSet>

      <!-- Conditions & Banes & Burdens -->
      <section class="sheet-area nogrow">
        <conditions />
      </section>
    </div>

    <!-- Stats on right -->
    <PcConditionMeters
      class="flexcol margin-right"
      data-tooltip-direction="UP"
      labelPosition="left"
    />
  </SheetBasic>
</template>

<style lang="less" module>
.tabContent {
  height: inherit;
}
.tabSet {
  margin-top: 0.5rem;
}
</style>

<style lang="less" scoped>
.character-sheet-classic {
  gap: 10px;
}
.stat-roll {
  text-transform: uppercase;
}
</style>

<script setup lang="ts">
import { ActorKey } from './provisions'
import AttrBox from './components/attr-box.vue'
import { IronswornActor } from '../actor/actor'
import { provide, computed } from 'vue'
import CharacterHeader from './components/character-header.vue'
import Conditions from './components/conditions/conditions.vue'
import { CharacterDataProperties } from '../actor/actortypes'
import SheetBasic from './sheet-basic.vue'
import PcConditionMeters from './components/resource-meter/pc-condition-meters.vue'
import MomentumMeterSlider from './components/resource-meter/momentum-meter.vue'
import TabSet from './components/tabs-new/tab-set.vue'
import TabList from './components/tabs-new/tab-list.vue'
import Tab from './components/tabs-new/tab.vue'
import TabPanels from './components/tabs-new/tab-panels.vue'
import TabPanel from './components/tabs-new/tab-panel.vue'
import IronswornMain from './components/character-sheet-tabs/ironsworn-main.vue'
import IronswornNotes from './components/character-sheet-tabs/ironsworn-notes.vue'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject>
}>()

provide(
  ActorKey,
  computed(() => props.actor)
)
</script>
