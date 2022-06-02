<template>
  <article class="sf-character-sheet">
    <sf-characterheader :actor="actor" />
    <momentum :actor="actor" />
    <stats :actor="actor" />
    <tabbed-panels :actor="actor" name="sf-main" :tabs="tabs" />
    <section class="condition-meters">
      <condition-meter
        v-for="meter in [health, spirit, supply]"
        :tooltip="`Roll +${meter.attr}`"
        :key="meter.attr"
        :attr="meter.attr"
        :actor="actor"
        :min="meter.min"
        :max="meter.max"
        :current="actor.data[meter.attr]"
      >
        {{ game.i18n.localize(meter.i18nLabelKey) }}
      </condition-meter>
    </section>
    <sf-impacts :actor="actor" />
  </article>
</template>

<style lang="less">
@import '../../styles/styles.less';
@import '../../styles/mixins.less';
.sf-character-sheet {
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  grid-template-rows: max-content max-content 1fr max-content;
  gap: 0.75em;

  .sheet-header {
    grid-row: 1;
    grid-column: span 3;
    gap: 6px;
    .character-vitals {
      flex-basis: 100px;
      gap: 7px;
    }
    .character-bio {
      flex-basis: 300px;
    }
  }

  .momentum-widget {
    grid-column: 1;
    grid-row: span 2;
    // height: max-content;
    .margin-left();
  }

  .stats {
    grid-row: 2;
    grid-column: 2;
    flex: 0;
    height: max-content;
  }

  .momentum-widget,
  .condition-meters {
    .resource-meter-title {
      .vertical-v2();
    }
    .condition-meter {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-grow: 0;
      .resource-meter-title {
        text-align: start;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: start;
        gap: 0.25em;
      }
    }
    .resource-meter {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: flex-start;
      min-width: 50px;
      flex-wrap: nowrap;
      flex-grow: 0;
    }
  }
  .tabbed-panels {
    grid-row: 3;
    grid-column: 2;
    [role^='tablist'],
    [role*=' tablist'] {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      height: max-content;
    }
    [role^='tabpanel'],
    [role*=' tabpanel'] {
      margin: 0.5rem;
    }
    [role='tab'],
    [role^='tab '],
    [role*=' tab'] {
      .stripButton();
      flex: 1 1 0;
      border-top: 1px solid;
      border-bottom: 1px solid;
      text-align: center;
      height: 100%;
      overflow-y: auto;
      padding: 5px;
      font-weight: bold;
      &.active {
        background-color: darkgray;
        text-decoration: underline;
        text-shadow: none;
      }
    }
  }
  .condition-meters {
    grid-column: 3;
    grid-row: span 2;

    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    .margin-right();
    .fake-hr-children(1px solid, 7px);
  }
  .impacts {
    grid-column: span 3;
    grid-row: 4;
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
      { titleKey: 'IRONSWORN.Legacies', component: 'sf-legacies' },
      { titleKey: 'IRONSWORN.Assets', component: 'sf-assets' },
      { titleKey: 'IRONSWORN.Progress', component: 'sf-progresses' },
      { titleKey: 'IRONSWORN.Connections', component: 'sf-connections' },
      { titleKey: 'IRONSWORN.Notes', component: 'sf-notes' },
    ]
    return {
      tabs,
      currentTab: tabs[0],
      health: { attr: 'health', i18nLabelKey: 'IRONSWORN.Health', min: 0, max: 5 },
      spirit: { attr: 'spirit', i18nLabelKey: 'IRONSWORN.Spirit', min: 0, max: 5 },
      supply: { attr: 'supply', i18nLabelKey: 'IRONSWORN.Supply', min: 0, max: 5 },
    }
  },

  methods: {
    openCompendium(name) {
      const pack = game.packs?.get(`foundry-ironsworn.${name}`)
      pack?.render(true)
    },
    updateAttr(attr, value) {
      this.$actor.data.update({ data: { [attr]: value } })
    },
  },
}
</script>
