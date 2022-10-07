<template>
  <SheetBasic :document="actor" class="shared-sheet">
    <section class="sheet-area nogrow">
      <ConditionMeter
        sliderStyle="horizontal"
        attr="supply"
        :statLabel="$t('IRONSWORN.Supply')"
        :max="5"
        :min="0"
        :currentValue="actor.data.supply"
        documentType="Actor"
        :global="IronswornSettings.globalSupply"
      />
    </section>

    <section v-if="hasBonds" class="sheet-area nogrow">
      <bonds :compact-progress="true" />
    </section>

    <active-completed-progresses />

    <section class="sheet-area">
      <h4 class="nogrow">{{ $t('IRONSWORN.Notes') }}</h4>
      <mce-editor
        v-model="actor.data.biography"
        @save="saveNotes"
        @change="throttledSaveNotes"
      />
    </section>
  </SheetBasic>
</template>

<style lang="less" scoped>
.stat-roll {
  text-transform: uppercase;
}

h3 {
  margin: 5px 0;
  transition: background-color 0.2s ease;
}

textarea.notes {
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 1px;
  font-family: var(--font-primary);
  resize: none;
  flex: 1;
  min-height: 150px;
}
</style>

<script setup lang="ts">
import { provide, computed, inject } from 'vue'
import { $ActorKey, ActorKey } from './provisions'
import Bonds from './components/bonds.vue'
import MceEditor from './components/mce-editor.vue'
import { throttle } from 'lodash'
import ActiveCompletedProgresses from './components/active-completed-progresses.vue'
import { BondsetDataProperties } from '../item/itemtypes'
import SheetBasic from './sheet-basic.vue'
import ConditionMeter from './components/resource-meter/condition-meter.vue'
import { IronswornSettings } from '../helpers/settings.js'

const props = defineProps<{
  actor: any
}>()
provide(ActorKey, computed(() => props.actor) as any)
const $actor = inject($ActorKey)

const hasBonds = computed(() => {
  const bonds = props.actor.items.find((x) => x.type === 'bondset') as
    | BondsetDataProperties
    | undefined
  const markedBonds = bonds?.data?.bonds?.length
  return markedBonds && markedBonds > 0
})

function saveNotes() {
  $actor?.update({ 'data.biography': props.actor.data.biography })
}
const throttledSaveNotes = throttle(saveNotes, 1000)
</script>
