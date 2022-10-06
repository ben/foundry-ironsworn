<template>
  <article class="flexcol sf-character-sheet">
    <!-- TODO: rm inline styles added to maintain consistent styling (required largely because of other inline styles) -->
    <!-- Header row -->
    <sf-characterheader />

    <!-- Main body row -->
    <div class="flexrow">
      <!-- Momentum on left -->
      <div class="flexcol margin-left nogrow" style="width: min-content">
        <MomentumMeterSpinner
          labelPosition="right"
          data-tooltip-direction="UP"
        />
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
      <PcConditionMeters
        class="flexcol margin-right"
        data-tooltip-direction="UP"
        labelPosition="left"
      />
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
import SfLegacies from './components/character-sheet-tabs/sf-legacies.vue'
import SfConnections from './components/character-sheet-tabs/sf-connections.vue'
import SfCharacterheader from './components/sf-characterheader.vue'
import Tabs from './components/tabs/tabs.vue'
import Tab from './components/tabs/tab.vue'
import SfImpacts from './components/sf-impacts.vue'
import SfAssets from './components/character-sheet-tabs/sf-assets.vue'
import SfProgresses from './components/character-sheet-tabs/sf-progresses.vue'
import SfNotes from './components/character-sheet-tabs/sf-notes.vue'
import { ActorKey } from './provisions.js'
import PcConditionMeters from './components/resource-meter/pc-condition-meters.vue'
import MomentumMeterSpinner from './components/resource-meter/momentum-meter-spinner.vue'

const props = defineProps<{
  actor: any
}>()

provide(ActorKey, computed(() => props.actor) as any)
</script>
