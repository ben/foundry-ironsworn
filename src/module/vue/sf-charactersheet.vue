<template>
  <article class="flexcol sf-character-sheet">
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
                {{ $t('IRONSWORN.Burn') }}
              </btn-momentumburn>

              {{ $t('IRONSWORN.Reset') }}: {{ actor.data.momentumReset }}
              {{ $t('IRONSWORN.Max') }}:
              {{ actor.data.momentumMax }}
            </div>
          </div>

          <h4 class="vertical nogrow">
            {{ $t('IRONSWORN.Momentum') }}
          </h4>
        </div>
      </div>

      <!-- Center area -->
      <div class="flexcol">
        <!-- Attributes -->
        <div
          class="flexrow stats"
          style="margin-bottom: 10px"
          data-tooltip-direction="UP"
        >
          <attr-box attr="edge" />
          <attr-box attr="heart" />
          <attr-box attr="iron" />
          <attr-box attr="shadow" />
          <attr-box attr="wits" />
        </div>

        <tabs class="character-sheet-tabs" name="character-sheet-tabs">
          <tab :title="$t('IRONSWORN.Legacies')">
            <sf-legacies :actor="actor" />
          </tab>
          <tab :title="$t('IRONSWORN.Assets')"> <sf-assets /> </tab>
          <tab :title="$t('IRONSWORN.Progress')"> <sf-progresses /> </tab>
          <tab :title="$t('IRONSWORN.Connections')"> <sf-connections /> </tab>
          <tab :title="$t('IRONSWORN.Notes')"> <sf-notes /> </tab>
        </tabs>
      </div>

      <!-- Stats on right -->
      <div
        class="flexcol margin-right condition-meters"
        data-tooltip-direction="UP"
      >
        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat
            class="vertical nogrow text"
            attr="health"
            :statLabel="$t('IRONSWORN.Health')"
          >
            {{ $t('IRONSWORN.Health') }}
          </btn-rollstat>
          <div class="flexcol stack health">
            <stack stat="health" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat
            class="vertical nogrow text"
            attr="spirit"
            :statLabel="$t('IRONSWORN.Spirit')"
          >
            {{ $t('IRONSWORN.Spirit') }}
          </btn-rollstat>
          <div class="flexcol stack spirit">
            <stack stat="spirit" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat
            class="vertical nogrow text"
            attr="supply"
            :statLabel="$t('IRONSWORN.Supply')"
          >
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
    <sf-impacts class="nogrow" />
  </article>
</template>

<style lang="less">
.sf-character-sheet {
  gap: 7px;
  .stat-roll {
    text-transform: uppercase;
  }
  .condition-meters {
    .icon-button {
      flex-direction: column;
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
import { computed, provide } from 'vue'
import AttrBox from './components/attr-box.vue'
import BtnMomentumburn from './components/buttons/btn-momentumburn.vue'
import SfLegacies from './components/character-sheet-tabs/sf-legacies.vue'
import SfConnections from './components/character-sheet-tabs/sf-connections.vue'
import SfCharacterheader from './components/sf-characterheader.vue'
import Stack from './components/stack/stack.vue'
import Tabs from './components/tabs/tabs.vue'
import Tab from './components/tabs/tab.vue'
import btnRollstat from './components/buttons/btn-rollstat.vue'
import sfImpacts from './components/sf-impacts.vue'
import SfAssets from './components/character-sheet-tabs/sf-assets.vue'
import SfProgresses from './components/character-sheet-tabs/sf-progresses.vue'
import SfNotes from './components/character-sheet-tabs/sf-notes.vue'

const props = defineProps<{
  actor: any
}>()

provide(
  'actor',
  computed(() => props.actor)
)
</script>
