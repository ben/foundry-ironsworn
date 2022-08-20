<template>
  <div class="flexcol">
    <header class="sheet-header nogrow" style="gap: 5px">
      <document-img :document="actor" />
      <document-name :document="actor" />
    </header>

    <Tabs>
      <Tab :title="$t('IRONSWORN.Assets')">
        <SfAssets />
      </Tab>
      <Tab :title="$t('IRONSWORN.Notes')">
        <SfNotes />
      </Tab>
    </Tabs>

    <hr class="nogrow" />

    <section class="flexrow nogrow">
      <div style="text-align: center">
        <condition-checkbox class="nogrow" name="battered" :global="true" />
      </div>
      <div style="text-align: center">
        <condition-checkbox class="nogrow" name="cursed" :global="true" />
      </div>
    </section>
  </div>
</template>

<style lang="less" scoped>
.tablist {
  border-bottom: 1px solid grey;
}
.tab {
  padding: 5px;
  &.active {
    background-color: darkgray;
  }
}
</style>

<script setup lang="ts">
import { provide, computed } from 'vue'
import { IronswornActor } from '../actor/actor'
import Tabs from './components/tabs/tabs.vue'
import Tab from './components/tabs/tab.vue'
import SfAssets from './components/character-sheet-tabs/sf-assets.vue'
import SfNotes from './components/character-sheet-tabs/sf-notes.vue'
import documentImg from './components/document-img.vue'
import ConditionCheckbox from './components/conditions/condition-checkbox.vue'
import DocumentName from './components/document-name.vue'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject>
}>()

provide(
  'actor',
  computed(() => props.actor)
)
</script>
