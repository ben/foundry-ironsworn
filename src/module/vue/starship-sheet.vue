<template>
  <div class="flexcol">
    <header class="sheet-header nogrow">
      <document-img :document="actor" />
      <document-name :document="actor" />
    </header>

    <section class="flexrow nogrow">
      <div
        class="tab"
        v-for="tab in tabs"
        :key="tab.titleKey"
        :class="['clickable', 'block', { selected: currentTab === tab }]"
        @click="currentTab = tab"
      >
        {{ $t(tab.titleKey) }}
      </div>
    </section>

    <keep-alive>
      <component :is="currentTab.component" :actor="actor" style="margin: 0.5rem" />
    </keep-alive>

    <hr class="nogrow" />

    <section class="flexrow nogrow">
      <div style="text-align: center">
        <condition-checkbox class="nogrow" :actor="actor" name="battered" :global="true" />
      </div>
      <div style="text-align: center">
        <condition-checkbox class="nogrow" :actor="actor" name="cursed" :global="true" />
      </div>
    </section>
  </div>
</template>

<style lang="less" scoped>
.tab {
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
      { titleKey: 'IRONSWORN.Assets', component: 'sf-assets' },
      { titleKey: 'IRONSWORN.Notes', component: 'sf-notes' },
    ]
    return {
      tabs,
      currentTab: tabs[0],
    }
  },

  methods: {
    openCompendium() {
      const pack = game.packs?.get('foundry-ironsworn.starforgedassets')
      pack?.render(true)
    },
  },
}
</script>
