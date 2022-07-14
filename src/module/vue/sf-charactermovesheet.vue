<template>
  <tabbed-panels
    ariaOrientation="horizontal"
    name="sf-character-move-sheet"
    class="sf-character-move-sheet-tabs"
    wrapperElement="article"
    :actor="actor"
    :tabs="tabs"
    ref="tabs"
  >
  </tabbed-panels>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import tabbedPanels from './components/tabbed-panels.vue'

export default defineComponent({
  inject: ['actor'],

  components: { tabbedPanels },

  data() {
    const tabs = [
      {
        titleKey: 'IRONSWORN.Moves',
        component: 'sf-movesheetmoves',
      },
      {
        titleKey: 'IRONSWORN.Oracles',
        component: 'sf-movesheetoracles',
      },
    ]
    return {
      tabs,
      currentTab: tabs[0],
    }
  },

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
