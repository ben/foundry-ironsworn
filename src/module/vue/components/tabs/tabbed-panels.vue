<template>
  <component
    :is="wrapperElement"
    class="tabbed-panels"
    :aria-orientation="ariaOrientation"
  >
    <nav role="tablist">
      <button
        v-for="tab in tabs"
        class="block clickable text"
        role="tab"
        type="button"
        :id="`tab-${name}-${tab.titleKey}-${actor._id}`"
        :aria-controls="`tabpanel-${name}-${tab.titleKey}-${actor._id}`"
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
.tabbed-panels {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  [role='tab'],
  [role^='tab '],
  [role*=' tab'] {
    border: 0;
    flex: 1 1 0;
    text-align: center;
    height: 100%;
    overflow-y: auto;
    padding: 5px;
    &[aria-selected='true'] {
      background-color: darkgray;
      text-decoration: underline;
      text-shadow: none;
    }
  }
  &[aria-orientation='horizontal'] {
    [role^='tablist'],
    [role*=' tablist'] {
      border-block-end: 1px solid;
    }
  }
  &[aria-orientation='vertical'] {
    [role^='tablist'],
    [role*=' tablist'] {
      border-inline-end: 1px solid;
    }
  }
  [role^='tablist'],
  [role*=' tablist'] {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-grow: 0;
    height: max-content;
  }
  [role^='tabpanel'],
  [role*=' tabpanel'] {
    margin: 0.5rem;
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    wrapperElement: { type: String, default: 'section' },
    name: String, // used to distinguish this from other tab panels for purpose of ID generation
    tabs: [{ titleKey: String, component: Object }],
    ariaOrientation: { type: String, default: 'horizontal' },
  },
  data() {
    return {
      currentTab: this.tabs[0],
    }
  },
}
</script>
