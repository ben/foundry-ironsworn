<template>
  <div class="flexcol sf-character-sheet">
    <!-- Header row -->
    <sf-characterheader />

    <!-- Main body row -->
    <div class="flexrow">
      <!-- Momentum on left -->
      <div class="flexcol margin-left">
        <div class="flexrow" style="flex-wrap: nowrap">
          <div class="flexcol stack momentum">
            <stack
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
        <div class="flexrow stats" style="margin-bottom: 10px">
          <attr-box attr="edge" />
          <attr-box attr="heart" />
          <attr-box attr="iron" />
          <attr-box attr="shadow" />
          <attr-box attr="wits" />
        </div>

        <tabs class="character-sheet-tabs" name="character-sheet-tabs">
          <tab :title="$t('IRONSWORN.Legacies')"> <sf-legacies /> </tab>
          <tab :title="$t('IRONSWORN.Assets')"> <sf-assets /> </tab>
          <tab :title="$t('IRONSWORN.Progress')"> <sf-progresses /> </tab>
          <tab :title="$t('IRONSWORN.Connections')"> <sf-connections /> </tab>
          <tab :title="$t('IRONSWORN.Notes')"> <sf-notes /> </tab>
        </tabs>
      </div>

      <!-- Stats on right -->
      <div class="flexcol margin-right condition-meters">
        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat class="vertical-v2 text" :actor="actor" attr="health">
            {{ $t('IRONSWORN.Health') }}
          </btn-rollstat>
          <div class="flexcol stack health">
            <stack stat="health" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat class="vertical-v2 text" attr="spirit">
            {{ $t('IRONSWORN.Spirit') }}
          </btn-rollstat>
          <div class="flexcol stack spirit">
            <stack stat="spirit" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat class="vertical-v2 text" attr="supply">
            {{ $t('IRONSWORN.Supply') }}
          </btn-rollstat>
          <div class="flexcol stack supply">
            <stack stat="supply" :top="5" :bottom="0"></stack>
          </div>
        </div>
      </div>
    </div>

    <!-- Impacts -->
    <hr class="nogrow" />
    <sf-impacts :actor="actor" class="nogrow" />
  </div>
</template>

<style lang="less">
.sf-character-sheet {
  .stat-roll {
    text-transform: uppercase;
  }
  .tabbed-panels.character-sheet-tabs {
    [role^='tablist'],
    [role*=' tablist'] {
      &[aria-orientation='horizontal'] {
        border-block-start: 0;
      }
    }
  }
}
</style>

<script lang="ts" setup>
import { computed, inject, provide } from 'vue'
import AttrBox from './components/attr-box.vue'
import BtnMomentumburn from './components/buttons/btn-momentumburn.vue'
import SfLegacies from './components/character-sheet-tabs/sf-legacies.vue'
import SfConnections from './components/character-sheet-tabs/sf-connections.vue'
import SfCharacterheader from './components/sf-characterheader.vue'
import Stack from './components/stack/stack.vue'
import Tabs from './components/tabs/tabs.vue'
import Tab from './components/tabs/tab.vue'
import btnRollstat from './components/buttons/btn-rollstat.vue'
import btnIsicon from './components/buttons/btn-isicon.vue'
import sfImpacts from './components/sf-impacts.vue'
import { IronswornActor } from '../actor/actor'
import SfAssets from './components/character-sheet-tabs/sf-assets.vue'
import SfProgresses from './components/character-sheet-tabs/sf-progresses.vue'
import SfConnections1 from './components/character-sheet-tabs/sf-connections.vue'
import SfNotes from './components/character-sheet-tabs/sf-notes.vue'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject>
}>()

provide(
  'actor',
  computed(() => props.actor)
)

function openCompendium(name) {
  const pack = game.packs?.get(`foundry-ironsworn.${name}`)
  pack?.render(true)
}
</script>
