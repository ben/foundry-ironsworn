<template>
  <article class="flexcol foe-sheet">
    <header class="sheet-header nogrow">
      <document-img :document="actor" />
      <document-name :document="actor" />
    </header>

    <div v-if="foe">
      <div class="flexrow nogrow">
        <challengerank-pips :current="foe.data.rank" @click="setRank" class="nogrow" style="margin-right: 1em" />
        <h4>{{ rankText }}</h4>
        <icon-button icon="trash" @click="clearProgress" />
        <icon-button icon="caret-right" @click="markProgress" />
      </div>

      <!-- PROGRESS -->
      <div class="flexrow track nogrow" style="margin-bottom: 1em">
        <progress-track :ticks="foe.data.current" />
      </div>

      <hr class="nogrow" />

      <!-- DESCRIPTION -->
      <div v-html="foe.data.description" />
    </div>

    <div
      v-else
      class="flexcol ironsworn__drop__target"
      data-drop-type="progress"
      style="text-align: center; justify-items: space-around"
    >
      <div class="clickable block" @click="addEmpty">
        <i class="fas fa-file"></i>
        {{ $t('IRONSWORN.Progress') }}
      </div>

      <btn-compendium compendium="ironswornfoes"> {{ $t('IRONSWORN.Foes') }} (Ironsworn) </btn-compendium>
      <btn-compendium compendium="starforgedencounters"> {{ $t('IRONSWORN.Foes') }} (Starforged) </btn-compendium>
    </div>
  </article>
</template>

<style lang="less">
.foe-sheet {
  .ironsworn__drop__target .clickable.block {
    padding: 1rem;
    flex-grow: 0;
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
  },

  computed: {
    foe() {
      return this.actor.items.find((x) => x.type === 'progress')
    },
    foundryFoe() {
      return this.$actor.items.get(this.foe._id)
    },
    rankText() {
      return this.$t(CONFIG.IRONSWORN.Ranks[this.actor.data.rank])
    },
  },

  watch: {
    async foe(newFoe) {
      const data = { name: newFoe?.name, img: newFoe?.img }
      await this.$actor.update(data)
      await this.$actor.data.token.update(data)
    },
  },

  methods: {
    addEmpty() {
      Item.create({ name: 'Foe', type: 'progress', data: { subtype: 'foe' } }, { parent: this.$actor })
    },

    openCompendium(name) {
      const pack = game.packs?.get(`foundry-ironsworn.${name}`)
      pack?.render(true)
    },

    setRank(rank) {
      this.foundryFoe?.update({ data: { rank } })
      this.foe.data.rank = rank
    },

    clearProgress() {
      this.foundryFoe?.update({ 'data.current': 0 })
      this.foe.data.current = 0
    },

    markProgress() {
      const increment = CONFIG.IRONSWORN.RankIncrements[this.foe.data.rank]
      const newValue = Math.min(this.foe.data.current + increment, 40)
      this.foundryFoe.update({ 'data.current': newValue })
      this.foe.data.current = newValue
    },
  },
}
</script>
