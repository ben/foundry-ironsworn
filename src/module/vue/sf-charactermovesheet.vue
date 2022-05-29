<template>
  <article class="move-and-oracle-overview">
    <nav role="tablist">
      <button
        class="vuetab"
        role="tab"
        type="button"
        v-for="tab in tabs"
        :key="tab.titleKey"
        :class="['clickable', 'block', { selected: currentTab === tab }]"
        @click="currentTab = tab"
      >
        {{ $t(tab.titleKey) }}
      </button>
    </nav>
    <keep-alive>
      <component :is="currentTab.component" :actor="actor" role="tabpanel" ref="activeTab" />
    </keep-alive>
  </article>
</template>

<style lang="less">
@import '../../styles/styles.less';
.move-and-oracle-overview {
  .flexcol();
  [role='tablist'] {
    .flexrow();
    flex-grow: 0;
  }

  .oracles-overview {
  }
  .accordion {
    .flexcol();
    ul {
      li {
        ul {
        }
      }
    }
  }
  .overview {
    flex-grow: 1;
    .flexcol();
    .overview-search {
      margin-top: 0.5rem;
      .flexrow();
      flex-grow: 0;
      i.fa {
        padding: 6px;
        flex-grow: 0;
      }
    }

    .foundry-items {
      padding: 0 0.5rem;
    }
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
      { titleKey: 'IRONSWORN.Moves', component: 'sf-movesoverview' },
      { titleKey: 'IRONSWORN.Oracles', component: 'sf-oraclesoverview' },
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
