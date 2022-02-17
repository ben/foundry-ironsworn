<template>
  <div class="flexcol">
    <div class="flexrow nogrow" style="min-height: 30px">
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
      <component
        :is="currentTab.component"
        :actor="actor"
        style="margin: 0.5rem"
      />
    </keep-alive>
  </div>
</template>

<style lang="less" scoped>
.vuetab {
  text-align: center;
  padding: 5px;
  border-bottom: 1px solid grey;
  &.active {
    background-color: darkgray;
  }
}
</style>

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
}
</script>
