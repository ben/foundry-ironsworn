<template>
  <component :is="wrapperElement" class="tabbed-panels">
    <nav role="tablist">
      <button
        class="vuetab block clickable"
        role="tab"
        type="button"
        v-for="tab in tabs"
        :id="`tab-${name}-${tab.titleKey}-${actor._id}`"
        :aria-controls="`tabpanel-${name}-${tab.titleKey}-${actor._id}`"
        :key="tab.titleKey"
        :class="['clickable', 'block', { selected: currentTab === tab }]"
        @click="currentTab = tab"
      >
        {{ $t(tab.titleKey) }}
      </button>
    </nav>
    <keep-alive>
      <component
        :is="currentTab.component"
        :id="`tabpanel-${name}-${currentTab.titleKey}-${actor._id}`"
        :aria-labelledby="`tab-${name}-${currentTab.titleKey}-${actor._id}`"
        :actor="actor"
        role="tabpanel"
        ref="activeTab"
      />
    </keep-alive>
  </component>
</template>

<style lang="less">
@import '../../../../styles/mixins.less';
.tabbed-panels {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  [role='tab'],
  [role^='tab '],
  [role*=' tab'] {
    flex-grow: 1;
  }
  [role^='tablist'],
  [role*=' tablist'] {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-grow: 0;
  }
}
</style>

<script>
export default {
  computed: {
    wrapperElement() {
      return this.wrapper ?? 'section'
    },
  },
  props: {
    actor: Object,
    wrapper: String,
    name: String, // used to distinguish this from other tab panels for purpose of ID generation
    tabs: [{ titleKey: String, component: Object }],
  },

  data() {
    return {
      currentTab: this.tabs[0],
    }
  },
}
</script>
