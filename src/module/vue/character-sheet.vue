<template>
  <SheetBasic
    :document="data.actor"
    class="character-sheet-classic"
    bodyClass="flexrow"
    data-tourid="sheet"
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
        :tabKeys="['character', 'notes']"
        :id="`${data.actor._id}-character-sheet-classic`"
        :class="$style.tabSet"
        :v-slot:icon="{ size: 'sm' }"
      >
        <TabList>
          <Tab
            tab-key="character"
            :text="$t('IRONSWORN.ACTOR.TypeCharacter')"
          />
          <Tab tab-key="notes" :text="$t('Notes')" />
        </TabList>
        <TabPanels>
          <TabPanel tab-key="character" class="flexcol">
            <IronswornMain />
          </TabPanel>
          <TabPanel tab-key="notes" class="flexcol">
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
  margin-top: var(--ironsworn-spacer-lg);
}
</style>

<style lang="less" scoped>
.character-sheet-classic {
  gap: var(--ironsworn-spacer-xl);
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
import TabSet from './components/tabs/tab-set.vue'
import TabList from './components/tabs/tab-list.vue'
import Tab from './components/tabs/tab.vue'
import TabPanels from './components/tabs/tab-panels.vue'
import TabPanel from './components/tabs/tab-panel.vue'
import IronswornMain from './components/character-sheet-tabs/ironsworn-main.vue'
import IronswornNotes from './components/character-sheet-tabs/ironsworn-notes.vue'

const props = defineProps<{
  data: { actor: ReturnType<typeof IronswornActor.prototype.toObject> }
}>()

provide(
  ActorKey,
  computed(() => props.data.actor)
)
</script>
