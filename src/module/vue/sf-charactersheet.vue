<template>
  <div class="flexcol sf-character-sheet">
    <!-- TODO: rm inline styles added to maintain consistent styling (required largely because of other inline styles) -->
    <!-- Header row -->
    <sf-characterheader />

    <!-- Main body row -->
    <div class="flexrow">
      <!-- Momentum on left -->
      <div class="flexcol margin-left nogrow" style="width: min-content">
        <div
          class="flexrow nogrow"
          style="flex-wrap: nowrap; width: min-content"
        >
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
                {{ $t('IRONSWORN.MOMENTUM.BURN.Label') }}
              </btn-momentumburn>

              {{ $t('IRONSWORN.MOMENTUM.RESET.Label') }}:
              {{ actor.data.momentumReset }}
              {{ $t('IRONSWORN.MOMENTUM.MAXIMUM.Label') }}:
              {{ actor.data.momentumMax }}
            </div>
          </div>

          <h4
            class="vertical-v2 nogrow"
            style="width: 18px"
            data-tooltip="IRONSWORN.RESOURCE.MOMENTUM.Description"
          >
            {{ $t('IRONSWORN.RESOURCE.MOMENTUM.Label') }}
          </h4>
        </div>
      </div>

      <!-- Center area -->
      <div class="flexcol">
        <!-- Attributes -->
        <div class="flexrow stats" style="margin-bottom: 10px">
          <attr-box
            attr="edge"
            :data-tooltip="'IRONSWORN.STAT.EDGE.Description'"
          />
          <attr-box
            attr="heart"
            :data-tooltip="'IRONSWORN.STAT.HEART.Description'"
          />
          <attr-box
            attr="iron"
            :data-tooltip="'IRONSWORN.STAT.IRON.Description'"
          />
          <attr-box
            attr="shadow"
            :data-tooltip="'IRONSWORN.STAT.SHADOW.Description'"
          />
          <attr-box
            attr="wits"
            :data-tooltip="'IRONSWORN.STAT.WITS.Description'"
          />
        </div>

        <tabs class="character-sheet-tabs" name="character-sheet-tabs">
          <tab :title="$t('IRONSWORN.LEGACY.Title')"> <sf-legacies /> </tab>
          <tab :title="$t('IRONSWORN.ASSET.Title')"> <sf-assets /> </tab>
          <tab :title="$t('IRONSWORN.PROGRESS.Title')">
            <sf-progresses />
          </tab>
          <tab :title="$t('IRONSWORN.CONNECTION.Title')">
            <sf-connections />
          </tab>
          <tab :title="$t('Notes')"> <sf-notes /> </tab>
        </tabs>
      </div>

      <!-- Stats on right -->
      <div class="flexcol margin-right condition-meters">
        <div
          class="flexrow nogrow"
          style="flex-wrap: nowrap"
          :data-tooltip="'IRONSWORN.RESOURCE.HEALTH.Description'"
        >
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat class="vertical-v2 nogrow text" attr="health">
            {{ $t('IRONSWORN.RESOURCE.HEALTH.Label') }}
          </btn-rollstat>
          <div class="flexcol stack health">
            <stack stat="health" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div
          class="flexrow nogrow"
          style="flex-wrap: nowrap"
          :data-tooltip="'IRONSWORN.RESOURCE.SPIRIT.Description'"
        >
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat class="vertical-v2 nogrow text" attr="spirit">
            {{ $t('IRONSWORN.RESOURCE.SPIRIT.Label') }}
          </btn-rollstat>
          <div class="flexcol stack spirit">
            <stack stat="spirit" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div
          class="flexrow nogrow"
          style="flex-wrap: nowrap"
          :data-tooltip="'IRONSWORN.RESOURCE.SUPPLY.DESCRIPTION.Starforged'"
        >
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat class="vertical-v2 nogrow text" attr="supply">
            {{ $t('IRONSWORN.RESOURCE.SUPPLY.Label') }}
          </btn-rollstat>
          <div class="flexcol stack supply">
            <stack stat="supply" :top="5" :bottom="0"></stack>
          </div>
        </div>
      </div>
    </div>

    <!-- Impacts -->
    <hr class="nogrow" />
    <sf-impacts class="nogrow" />
  </div>
</template>

<style lang="less">
.sf-character-sheet {
  .stat-roll {
    text-transform: uppercase;
  }
  .condition-meters {
    .icon-button {
      flex-direction: column;
      width: 18px;
      .button-text {
        writing-mode: vertical-lr;
      }
    }
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
