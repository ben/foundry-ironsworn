<template>
  <div class="flexcol sf-character-sheet">
    <!-- Header row -->
    <sf-characterheader :actor="actor" />

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
              <btn-momentumburn class="nogrow block stack-row" :actor="actor">
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
          <attr-box :actor="actor" attr="edge"></attr-box>
          <attr-box :actor="actor" attr="heart"></attr-box>
          <attr-box :actor="actor" attr="iron"></attr-box>
          <attr-box :actor="actor" attr="shadow"></attr-box>
          <attr-box :actor="actor" attr="wits"></attr-box>
        </div>

        <tabbed-panels
          aria-orientation="horizontal"
          class="character-sheet-tabs"
          name="character-sheet-tabs"
          wrapperElement="section"
          :actor="actor"
          :tabs="tabs"
        >
        </tabbed-panels>
      </div>

      <!-- Stats on right -->
      <div class="flexcol margin-right condition-meters">
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

<script lang="ts">
import { defineComponent } from 'vue'
import SfCharacterheader from './components/sf-characterheader.vue'
import Stack from './components/stack/stack.vue'

export default defineComponent({
  inject: ['actor'],

  components: {
    SfCharacterheader,
    Stack,
  },

  data() {
    const tabs = [
      { titleKey: 'IRONSWORN.Legacies', component: 'sf-legacies' },
      { titleKey: 'IRONSWORN.Assets', component: 'sf-assets' },
      { titleKey: 'IRONSWORN.Progress', component: 'sf-progresses' },
      { titleKey: 'IRONSWORN.Connections', component: 'sf-connections' },
      { titleKey: 'IRONSWORN.Notes', component: 'sf-notes' },
    ]
    return {
      tabs,
      currentTab: tabs[0],
    }
  },
  methods: {
    rollStat(stat) {
      CONFIG.IRONSWORN.RollDialog.show({ actor: this.$actor, stat })
    },
    openCompendium(name) {
      const pack = game.packs?.get(`foundry-ironsworn.${name}`)
      pack?.render(true)
    },
  },
})
</script>
