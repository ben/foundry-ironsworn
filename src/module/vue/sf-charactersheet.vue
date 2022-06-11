<template>
  <article class="sf-character-sheet">
    <sf-characterheader :actor="actor" />
    <momentum :actor="actor" :current="actor.data.momentum" />
    <stats :actor="actor" :aria-label="$t('IRONSWORN.stats')" />
    <tabbed-panels :actor="actor" name="sf-main" :tabs="tabs" />
    <section class="condition-meters" :aria-label="$t('IRONSWORN.conditionMeters')">
      <condition-meter
        v-for="meter in [health, spirit, supply]"
        :aria-label="$t('IRONSWORN.meter', { meterType: $t(meter.i18nLabelKey) })"
        :tooltip="$t('IRONSWORN.rollPlusStat', { stat: $t(meter.i18nLabelKey) })"
        :key="meter.attr"
        :attr="meter.attr"
        :actor="actor"
        :min="meter.min"
        :max="meter.max"
        :current="actor.data[meter.attr]"
      >
        {{ $t(meter.i18nLabelKey) }}
      </condition-meter>
    </section>
    <sf-impacts :actor="actor" :aria-label="$t('IRONSWORN.impacts')" />
  </article>
</template>

<style lang="less">
// @import '../../styles/styles.less';
@import '../../styles/mixins.less';
.sf-character-sheet {
  // display: grid;
  // grid-template-columns: max-content 1fr 1fr 1fr max-content;
  // grid-template-rows: max-content max-content 1fr max-content;
  // gap: 0.75rem;

  display: grid;
  grid-template-columns: 75px 1fr 1fr 1fr 1fr 1fr 75px;
  grid-template-rows: 75px max-content 1fr max-content;
  gap: 0.5rem;
  grid-template-areas:
    'img vitals vitals bio bio bio bio'
    'momentum stats stats stats stats stats meters'
    'momentum main main main main main meters'
    'impacts impacts impacts impacts impacts impacts impacts';
  header.sheet-header {
    display: contents;
    .doc-img {
      grid-area: img;
    }
    .character-vitals {
      grid-area: vitals;
    }
    .character-bio {
      grid-area: bio;
    }
  }

  .momentum-widget {
    // grid-column: 1;
    // grid-row: span 2;
    grid-area: momentum;
    border-right: 1px solid;
  }

  .stats {
    // grid-row: 2;
    // grid-column: 2;
    flex: 0;
    height: max-content;
    grid-area: stats;
  }

  .momentum-widget,
  .condition-meters {
    .resource-meter-title {
      .vertical-v2();
      &:before {
        transform: rotate(90deg);
      }
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
    grid-area: main;
  }
  .condition-meters {
    // grid-column: 3;
    // grid-row: span 2;
    grid-area: meters;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    border-left: 1px solid;
    .fake-hr-children(1px solid, 7px);
  }
  .impacts {
    grid-area: impacts;
    border-top: 1px solid;
    // grid-column: span 3;
    // grid-row: 4;
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
