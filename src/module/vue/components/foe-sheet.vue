<template>
  <div class="flexcol">
    <header class="sheet-header nogrow">
      <document-img :document="actor" />
      <document-name :document="actor" />
    </header>

    <div v-if="foe">
      <div class="flexrow nogrow">
        <rank-hexes
          :current="foe.data.rank"
          @click="setRank"
          class="nogrow"
          style="margin-right: 1em"
        />
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
      <editor
        target="data.description"
        :owner="true"
        :button="true"
        :editable="true"
        :content="foe.data.description"
      />
    </div>

    <div
      v-else
      class="flexrow ironsworn__drop__target"
      data-drop-type="progress"
      style="text-align: center"
    >
      <div class="clickable block" @click="addEmpty">
        <i class="fas fa-plus"></i>
        {{ $t('IRONSWORN.Progress') }}
      </div>

      <div class="clickable block" @click="openCompendium('ironswornfoes')">
        <i class="fas fa-atlas"></i>
        {{ $t('IRONSWORN.Foes') }} (Ironsworn)
      </div>
      <div
        class="clickable block"
        @click="openCompendium('starforgedencounters')"
      >
        <i class="fas fa-atlas"></i>
        {{ $t('IRONSWORN.Foes') }} (Starforged)
      </div>
    </div>
  </div>
</template>

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
      this.$actor.items.find((x) => x.id === this.foe?._id)
    },
  },

  watch: {
    foe(newFoe) {
      this.$actor.update({
        name: newFoe.name,
        // TODO: image
      })
      // TODO: token images
    },
  },

  methods: {
    openCompendium(name) {
      const pack = game.packs?.get(`foundry-ironsworn.${name}`)
      pack?.render(true)
    },
  },
}
</script>
