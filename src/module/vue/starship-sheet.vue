<template>
  <article class="flexcol starship-sheet">
    <header class="sheet-header nogrow">
      <document-img :document="actor" />
      <document-name :document="actor" />
    </header>

    <tabbed-panels :actor="actor" name="starship" :tabs="tabs" />

    <hr class="nogrow" />

    <section class="flexrow nogrow">
      <div style="text-align: center">
        <condition-checkbox class="nogrow" :actor="actor" name="battered" :global="true" />
      </div>
      <div style="text-align: center">
        <condition-checkbox class="nogrow" :actor="actor" name="cursed" :global="true" />
      </div>
    </section>
  </article>
</template>

<style lang="less">
.starship-sheet {
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
