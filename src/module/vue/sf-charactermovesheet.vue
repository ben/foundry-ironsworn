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
  <!-- <div class="flexcol">
    <div class="flexrow nogrow tablist" style="min-height: 30px">
      <div
        class="vuetab"
        v-for="tab in tabs"
        :key="tab.titleKey"
        :class="['clickable', 'block', { selected: currentTab === tab }]"
        @click="currentTab = tab"
      >
        {{ $t(tab.titleKey) }}
      </div>
    </div>
    <keep-alive>
      <component :is="currentTab.component" :actor="actor" ref="activeTab" />
    </keep-alive>
  </div> -->
</template>

<script>
export default {
  props: {
    actor: Object,
  },

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
}
</script>
