<template>
  <tabbed-panels wrapper="article" :actor="actor" name="moves" :tabs="tabs" class="character-move-sheet" />
</template>

<style lang="less">
@import '../../styles/styles.less';
.character-move-sheet {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  .vuetab {
    text-align: center;
    padding: 5px;
    border-bottom: 1px solid grey;
    &.active {
      background-color: darkgray;
    }
  }
  [role^='tablist'],
  [role*=' tablist'] {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-grow: 0;
  }

  .oracles-overview {
  }
  .accordion {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    ul {
      li {
        ul {
        }
      }
    }
  }
  .overview {
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    gap: 0.5rem;
    margin: 0.5rem;
    .overview-search {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      input[type='search'] {
        flex-grow: 1;
      }
      .fa {
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
