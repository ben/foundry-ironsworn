<template>
  <SheetBasic :document="actor" body-class="flexcol">
    <TabSet :id="`${actor._id}-starship-sheet`">
      <TabList>
        <Tab :index="0">{{ $t('IRONSWORN.Assets') }}</Tab>
        <Tab :index="1">{{ $t('IRONSWORN.Notes') }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel :index="0"><SfAssets /></TabPanel>
        <TabPanel :index="1"><SfNotes /></TabPanel>
      </TabPanels>
    </TabSet>

    <hr class="nogrow" />

    <section class="flexrow nogrow">
      <div style="text-align: center">
        <condition-checkbox
          class="nogrow"
          name="battered"
          :global-hint="true"
        />
      </div>
      <div style="text-align: center">
        <condition-checkbox class="nogrow" name="cursed" :global-hint="true" />
      </div>
    </section>
  </SheetBasic>
</template>

<style lang="less" scoped></style>

<script setup lang="ts">
import { provide, computed } from 'vue'
import { IronswornActor } from '../actor/actor'
import SfAssets from './components/character-sheet-tabs/sf-assets.vue'
import SfNotes from './components/character-sheet-tabs/sf-notes.vue'
import ConditionCheckbox from './components/conditions/condition-checkbox.vue'
import SheetBasic from './sheet-basic.vue'
import { ActorKey } from './provisions.js'
import TabSet from './components/tabs-new/tab-set.vue'
import TabList from './components/tabs-new/tab-list.vue'
import Tab from './components/tabs-new/tab.vue'
import TabPanels from './components/tabs-new/tab-panels.vue'
import TabPanel from './components/tabs-new/tab-panel.vue'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject>
}>()

provide(ActorKey, computed(() => props.actor) as any)
</script>
