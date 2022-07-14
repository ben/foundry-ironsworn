<template>
  <tabs>
    <tab :title="$t('IRONSWORN.Moves')">
      <sf-movesheetmoves />
    </tab>
    <tab :title="$t('IRONSWORN.Oracles')">
      <sf-movesheetoracles />
    </tab>
  </tabs>
  <!-- <tabbed-panels
    ariaOrientation="horizontal"
    name="sf-character-move-sheet"
    class="sf-character-move-sheet-tabs"
    wrapperElement="article"
    :actor="actor"
    :tabs="tabs"
    ref="tabs"
  >
  </tabbed-panels> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import tabbedPanels from './components/tabbed-panels.vue'
import Tab from './components/tabs/tab.vue'
import Tabs from './components/tabs/tabs.vue'
import SfMovesheetmoves from './components/sf-movesheetmoves.vue'
import SfMovesheetoracles from './components/sf-movesheetoracles.vue'

export default defineComponent({
  inject: ['actor'],

  components: { tabbedPanels, Tabs, Tab, SfMovesheetmoves, SfMovesheetoracles },

  methods: {
    async highlightMove(item) {
      this.currentTab = this.tabs[0]
      await this.$nextTick()
      this.$refs.tabs.$refs.activeTab?.['highlightMove']?.(item)
    },

    async highlightOracle(dfid) {
      this.currentTab = this.tabs[1]
      await this.$nextTick()
      this.$refs.tabs.$refs.activeTab?.['highlightOracle']?.(dfid)
    },
  },
})
</script>
