<template>
  <SheetBasic :document="actor">
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
  </SheetBasic>
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
import ConditionCheckbox from './components/conditions/condition-checkbox.vue'
import SheetBasic from './sheet-basic.vue'
import { ActorKey } from './provisions.js'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject>
}>()

provide(ActorKey, computed(() => props.actor) as any)
</script>
