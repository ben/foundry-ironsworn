<template>
  <div class="flexcol move-sheet">
    <!-- TODO: refactor tab elements like this one for accessibility (annotation, IDs so the tab/panel relationship is made explicitly, etc)
    MDN docs: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role
    this one is incomplete.
    a better bet might be to borrow from an existing component where someone's already put the work in:
    https://github.com/jakedohm/vue-accessible-tabs
    -->
    <nav class="flexrow nogrow tabs" role="tablist">
      <button
        class="vuetab"
        role="tab"
        v-for="tab in tabs"
        :key="tab.titleKey"
        :class="['clickable', 'block', { selected: currentTab === tab }]"
        @click="currentTab = tab"
      >
        {{ $t(tab.titleKey) }}
      </button>
    </nav>
    <keep-alive>
      <component :is="currentTab.component" :actor="actor" ref="activeTab" />
    </keep-alive>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
  },

  data() {
    const tabs = [
      { titleKey: 'IRONSWORN.Moves', component: 'sf-movesheetmoves' },
      { titleKey: 'IRONSWORN.Oracles', component: 'sf-movesheetoracles' },
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
      this.$refs.activeTab?.['highlightMove']?.(item)
    },

    async highlightOracle(dfid) {
      this.currentTab = this.tabs[1]
      await this.$nextTick()
      this.$refs.activeTab?.['highlightOracle']?.(dfid)
    },
  },
}
</script>
