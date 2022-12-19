<template>
  <SheetBasic :document="actor" body-class="flexcol">
    <TabSet :id="`${actor._id}-starship-sheet`" :tabKeys="['assets', 'notes']">
      <TabList>
        <Tab tab-key="assets" :text="$t('IRONSWORN.Assets')" />
        <Tab tab-key="notes" :text="$t('IRONSWORN.Notes')" />
      </TabList>
      <TabPanels>
        <TabPanel tab-key="assets" class="flexcol">
          <SfAssets />
        </TabPanel>
        <TabPanel tab-key="notes" class="flexcol">
          <SfNotes />
        </TabPanel>
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
import TabSet from './components/tabs/tab-set.vue'
import TabList from './components/tabs/tab-list.vue'
import Tab from './components/tabs/tab.vue'
import TabPanels from './components/tabs/tab-panels.vue'
import TabPanel from './components/tabs/tab-panel.vue'
import IronButton from './components/buttons/iron-btn.vue'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject>
}>()

provide(ActorKey, computed(() => props.actor) as any)
</script>
