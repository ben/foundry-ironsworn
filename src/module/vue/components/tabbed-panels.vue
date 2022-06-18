<template>
  <component :is="wrapperElement" class="tabbed-panels">
    <nav role="tablist" :aria-orientation="ariaOrientation">
      <button
        v-for="tab in tabs"
        class="block clickable text"
        role="tab"
        type="button"
        :id="tabId(tab)"
        :aria-controls="tabPanelId(tab)"
        :aria-selected="currentTab === tab"
        :key="tab.titleKey"
        @click="currentTab = tab"
      >
        {{ $t(tab.titleKey) }}
      </button>
    </nav>
    <keep-alive>
      <component
        :is="currentTab.component"
        :id="tabPanelId(currentTab)"
        :aria-labelledby="tabId(currentTab)"
        :actor="actor"
        role="tabpanel"
        ref="activeTab"
      />
    </keep-alive>
  </component>
</template>

<style lang="less">
.tabbed-panels {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  [role='tab'], // so it doesn't catch things that only start with 'tab'
  [role^='tab '],
  [role*=' tab'] {
    border: 0;
    flex: 1 1 0;
    text-align: center;
    height: 100%;
    overflow-y: auto;
    padding: 5px;
    &[aria-selected='true'] {
      text-decoration: underline;
      text-shadow: none;
    }
  }
  [role^='tablist'],
  [role*=' tablist'] {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-grow: 0;
    height: max-content;
    &[aria-orientation='horizontal'] {
      border-block-end: 1px solid darkgrey;
    }
    &[aria-orientation='vertical'] {
      border-inline-end: 1px solid darkgrey;
    }
  }
  [role^='tabpanel'],
  [role*=' tabpanel'] {
    margin: 0.5rem;
    flex: 1;
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    wrapperElement: { type: String, default: 'article' },
    /* used to distinguish this from other tab panels for purpose of ID generation */
    name: String,
    tabs: Array,
    ariaOrientation: {
      type: String,
      default: 'horizontal',
    },
  },
  methods: {
    stubId(tabData) {
      return `${this.name}-${tabData.titleKey}-${this.actor._id}`
    },
    tabPanelId(tabData) {
      return `tabpanel-${this.stubId(tabData)}`
    },
    tabId(tabData) {
      return `tab-${this.stubId(tabData)}`
    },
  },
  data() {
    return {
      currentTab: this.tabs[0],
    }
  },
}
</script>
