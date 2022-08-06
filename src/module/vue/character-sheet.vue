<template>
  <div class="flexcol">
    <!-- Header row -->
    <character-header />

    <!-- Main body row -->
    <div class="flexrow">
      <!-- Momentum on left -->
      <div class="flexcol margin-left">
        <div class="flexrow" style="flex-wrap: nowrap">
          <div class="flexcol stack momentum">
            <stack
              :actor="actor"
              stat="momentum"
              :top="10"
              :bottom="-6"
              :softMax="actor.data.momentumMax"
            ></stack>
            <hr class="nogrow" />
            <div>
              <btn-momentumburn class="nogrow block stack-row">
                {{ $t('IRONSWORN.Burn') }}
              </btn-momentumburn>

              {{ $t('IRONSWORN.Reset') }}: {{ actor.data.momentumReset }}
              {{ $t('IRONSWORN.Max') }}:
              {{ actor.data.momentumMax }}
            </div>
          </div>
          <h4 class="vertical-v2">{{ $t('IRONSWORN.Momentum') }}</h4>
        </div>
      </div>

      <!-- Center area -->
      <div class="flexcol">
        <!-- Attributes -->
        <div class="flexrow stats">
          <attr-box :actor="actor" attr="edge"></attr-box>
          <attr-box :actor="actor" attr="heart"></attr-box>
          <attr-box :actor="actor" attr="iron"></attr-box>
          <attr-box :actor="actor" attr="shadow"></attr-box>
          <attr-box :actor="actor" attr="wits"></attr-box>
        </div>

        <tabs style="margin-top: 0.5rem">
          <tab :title="$t('IRONSWORN.Character')"><ironsworn-main /></tab>
          <tab :title="$t('IRONSWORN.Notes')"><ironsworn-notes /></tab>
        </tabs>

        <!-- Conditions & Banes & Burdens -->
        <section class="sheet-area nogrow">
          <conditions :actor="actor" />
        </section>
      </div>

      <!-- Stats on right -->
      <div class="flexcol margin-right">
        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat class="vertical-v2 text" :actor="actor" attr="health">
            {{ $t('IRONSWORN.Health') }}
          </btn-rollstat>
          <div class="flexcol stack health">
            <stack :actor="actor" stat="health" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat class="vertical-v2 text" :actor="actor" attr="spirit">
            {{ $t('IRONSWORN.Spirit') }}
          </btn-rollstat>
          <div class="flexcol stack spirit">
            <stack :actor="actor" stat="spirit" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat class="vertical-v2 text" :actor="actor" attr="supply">
            {{ $t('IRONSWORN.Supply') }}
          </btn-rollstat>
          <div class="flexcol stack supply">
            <stack :actor="actor" stat="supply" :top="5" :bottom="0"></stack>
          </div>
        </div>
      </div>
    </div>
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
</style>

<script setup lang="ts">
import { $ActorKey } from './provisions'
import AttrBox from './components/attr-box.vue'
import BtnMomentumburn from './components/buttons/btn-momentumburn.vue'
import Stack from './components/stack/stack.vue'
import btnRollstat from './components/buttons/btn-rollstat.vue'
import { IronswornActor } from '../actor/actor'
import { provide, computed, inject } from 'vue'
import { RollDialog } from '../helpers/rolldialog'
import CharacterHeader from './components/character-header.vue'
import Conditions from './components/conditions/conditions.vue'
import { throttle } from 'lodash'
import Tabs from './components/tabs/tabs.vue'
import Tab from './components/tabs/tab.vue'
import IronswornMain from './components/character-sheet-tabs/ironsworn-main.vue'
import IronswornNotes from './components/character-sheet-tabs/ironsworn-notes.vue'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject>
}>()

provide(
  'actor',
  computed(() => props.actor)
)

const $actor = inject($ActorKey)

function burnMomentum() {
  $actor?.burnMomentum()
}
function rollStat(stat) {
  RollDialog.show({ actor: $actor, stat })
}
function openCompendium(name) {
  const pack = game.packs?.get(`foundry-ironsworn.${name}`)
  pack?.render(true)
}
</script>
