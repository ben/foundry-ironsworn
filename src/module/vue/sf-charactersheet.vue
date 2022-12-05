<template>
  <article class="flexcol sf-character-sheet">
    <!-- TODO: rm inline styles added to maintain consistent styling (required largely because of other inline styles) -->
    <!-- Header row -->
    <sf-characterheader />

    <!-- Main body row -->
    <div class="flexrow">
      <!-- Momentum on left -->
      <div class="flexcol margin-left nogrow" style="width: min-content">
        <MomentumMeterSlider
          labelPosition="right"
          data-tooltip-direction="UP"
        />
      </div>

      <!-- Center area -->
      <div class="flexcol">
        <!-- Attributes -->
        <div
          class="flexrow stats"
          style="margin-bottom: 10px"
          data-tooltip-direction="UP"
        >
          <attr-box attr="edge" />
          <attr-box attr="heart" />
          <attr-box attr="iron" />
          <attr-box attr="shadow" />
          <attr-box attr="wits" />
        </div>

        <TabSet :id="`${actor._id}_sf-character-sheet`">
          <TabList>
            <Tab :index="0">{{ $t('IRONSWORN.Legacies') }}</Tab>
            <Tab :index="1">{{ $t('IRONSWORN.Assets') }}</Tab>
            <Tab :index="2">{{ $t('IRONSWORN.Progress') }}</Tab>
            <Tab :index="3">{{ $t('IRONSWORN.Connections') }}</Tab>
            <Tab :index="4">{{ $t('IRONSWORN.Notes') }}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel :index="0" class="flexcol"><SfLegacies /></TabPanel>
            <TabPanel :index="1" class="flexcol"
              ><SfAssets :class="$style.topPadding"
            /></TabPanel>
            <TabPanel :index="2" class="flexcol"
              ><SfProgresses :class="$style.topPadding"
            /></TabPanel>
            <TabPanel :index="3" class="flexcol"
              ><SfConnections :class="$style.topPadding"
            /></TabPanel>
            <TabPanel :index="4" class="flexcol"><SfNotes /></TabPanel>
          </TabPanels>
        </TabSet>
      </div>

      <!-- Stats on right -->
      <PcConditionMeters
        class="flexcol margin-right"
        data-tooltip-direction="UP"
        labelPosition="left"
      />
    </div>

    <!-- Impacts -->
    <hr class="nogrow" />
    <sf-impacts class="nogrow" />
  </article>
</template>

<style lang="less" module>
.topPadding {
  padding-top: var(--ironsworn-spacer-lg);
}
</style>

<style lang="less">
.sf-character-sheet {
  gap: 7px;
  .stat-roll {
    text-transform: uppercase;
  }
  .condition-meters {
    .icon-button {
      flex-direction: column;
      .button-text {
        writing-mode: vertical-lr;
      }
    }
  }
}
</style>

<script lang="ts" setup>
import { computed, provide } from 'vue'
import AttrBox from './components/attr-box.vue'
import SfLegacies from './components/character-sheet-tabs/sf-legacies.vue'
import SfConnections from './components/character-sheet-tabs/sf-connections.vue'
import SfCharacterheader from './components/sf-characterheader.vue'
import SfImpacts from './components/sf-impacts.vue'
import SfAssets from './components/character-sheet-tabs/sf-assets.vue'
import SfProgresses from './components/character-sheet-tabs/sf-progresses.vue'
import SfNotes from './components/character-sheet-tabs/sf-notes.vue'
import { ActorKey } from './provisions.js'
import PcConditionMeters from './components/resource-meter/pc-condition-meters.vue'
import MomentumMeterSlider from './components/resource-meter/momentum-meter.vue'
import TabSet from './components/tabs-new/tab-set.vue'
import TabList from './components/tabs-new/tab-list.vue'
import Tab from './components/tabs-new/tab.vue'
import TabPanel from './components/tabs-new/tab-panel.vue'
import TabPanels from './components/tabs-new/tab-panels.vue'

const props = defineProps<{
  actor: any
}>()

provide(ActorKey, computed(() => props.actor) as any)
</script>
