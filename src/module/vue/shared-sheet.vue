<template>
  <SheetBasic :document="actor" class="shared-sheet" body-class="flexcol">
    <section class="sheet-area nogrow">
      <ConditionMeter
        sliderStyle="horizontal"
        attr="supply"
        :statLabel="$t('IRONSWORN.Supply')"
        :max="5"
        :min="0"
        :currentValue="actor.system.supply"
        documentType="Actor"
        :global="IronswornSettings.get('shared-supply')"
      />
    </section>

    <section v-if="hasBonds" class="sheet-area nogrow">
      <bonds :compact-progress="true" />
    </section>

    <active-completed-progresses />

    <section class="sheet-area flexcol">
      <h4 class="nogrow">{{ $t('Notes') }}</h4>
      <mce-editor v-model="actor.system.biography" @save="saveNotes" />
    </section>
  </SheetBasic>
</template>

<style lang="scss" scoped>
.stat-roll {
  text-transform: uppercase;
}

h3 {
  transition: background-color 0.2s ease;
  margin: var(--ironsworn-spacer-md) 0;
}

textarea.notes {
  flex: 1;
  border-radius: var(--ironsworn-border-radius-sm);
  border-color: rgb(0 0 0 / 10%);
  min-height: 150px;
  resize: none;
  font-family: var(--font-primary);
}
</style>

<script setup lang="ts">
import { provide, computed, inject } from 'vue'
import { $ActorKey, ActorKey } from './provisions'
import Bonds from './components/bonds.vue'
import MceEditor from './components/mce-editor.vue'
import { throttle } from 'lodash'
import ActiveCompletedProgresses from './components/active-completed-progresses.vue'
import { BondsetDataPropertiesData } from '../item/itemtypes'
import SheetBasic from './sheet-basic.vue'
import ConditionMeter from './components/resource-meter/condition-meter.vue'
import { IronswornSettings } from '../helpers/settings.js'

const props = defineProps<{
  actor: any
}>()
provide(ActorKey, computed(() => props.actor) as any)
const $actor = inject($ActorKey)

const hasBonds = computed(() => {
  const bonds = props.actor.items.find((x) => x.type === 'bondset')?.system as
    | BondsetDataPropertiesData
    | undefined
  const markedBonds = bonds?.bonds?.length
  return markedBonds && markedBonds > 0
})

function saveNotes() {
  $actor?.update({ 'system.biography': props.actor.system.biography })
}
</script>
