<template>
  <div class="flexcol">
    <header class="sheet-header flexrow nogrow" style="gap: 5px">
      <document-img :document="actor" />
      <document-name :document="actor" />
    </header>

    <section class="sheet-area nogrow">
      <btn-rollstat
        class="text"
        attr="supply"
        :statLabel="$t('IRONSWORN.Supply')"
      >
        {{ $t('IRONSWORN.Supply') }}
      </btn-rollstat>

      <boxrow
        style="line-height: 25px"
        :min="0"
        :max="5"
        :current="actor.data.supply"
        @click="setSupply"
      />
    </section>

    <section v-if="hasBonds" class="sheet-area nogrow">
      <bonds />
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
  </div>
</template>

<style lang="less" scoped>
.stat-roll {
  text-transform: uppercase;
}

.slide-enter-active,
.slide-leave-active {
  max-height: 83px;
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
import { IronswornActor } from '../actor/actor'
import { RollDialog } from '../helpers/rolldialog'
import { IronswornSettings } from '../helpers/settings'
import { $ActorKey } from './provisions'
import DocumentImg from './components/document-img.vue'
import DocumentName from './components/document-name.vue'
import Boxrow from './components/boxrow/boxrow.vue'
import Bonds from './components/bonds.vue'
import MceEditor from './components/mce-editor.vue'
import { throttle } from 'lodash'
import BtnRollstat from './components/buttons/btn-rollstat.vue'
import ActiveCompletedProgresses from './components/active-completed-progresses.vue'
import { BondsetDataProperties } from '../item/itemtypes'

const props = defineProps<{
  actor: any
}>()
provide(
  'actor',
  computed(() => props.actor)
)
const $actor = inject($ActorKey)

const hasBonds = computed(() => {
  const bonds = props.actor.items.find((x) => x.type === 'bondset') as
    | BondsetDataProperties
    | undefined
  const markedBonds = bonds?.data?.bonds?.length
  return markedBonds && markedBonds > 0
})
function setSupply(value) {
  $actor?.update({ data: { supply: value } })
  IronswornSettings.maybeSetGlobalSupply(value)
}
function rollSupply() {
  RollDialog.show({
    actor: $actor,
    stat: 'supply',
  })
}

function saveNotes() {
  $actor?.update({ 'data.biography': props.actor.data.biography })
}
const throttledSaveNotes = throttle(saveNotes, 1000)
</script>
