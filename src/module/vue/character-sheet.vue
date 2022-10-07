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

      <tabs style="margin-top: 0.5rem">
        <tab :title="$t('IRONSWORN.Character')"><ironsworn-main /></tab>
        <tab :title="$t('IRONSWORN.Notes')"><ironsworn-notes /></tab>
      </tabs>

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
import BtnMomentumburn from './components/buttons/btn-momentumburn.vue'
import Stack from './components/stack/stack.vue'
import { IronswornActor } from '../actor/actor'
import { provide, computed } from 'vue'
import CharacterHeader from './components/character-header.vue'
import Conditions from './components/conditions/conditions.vue'
import Tabs from './components/tabs/tabs.vue'
import Tab from './components/tabs/tab.vue'
import IronswornMain from './components/character-sheet-tabs/ironsworn-main.vue'
import IronswornNotes from './components/character-sheet-tabs/ironsworn-notes.vue'
import { CharacterDataProperties } from '../actor/actortypes'
import SheetBasic from './sheet-basic.vue'
import PcConditionMeters from './components/resource-meter/pc-condition-meters.vue'
import MomentumMeterSlider from './components/resource-meter/momentum-meter.vue'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject>
}>()
const actorData = props.actor as CharacterDataProperties

provide(
  ActorKey,
  computed(() => props.actor)
)
</script>
