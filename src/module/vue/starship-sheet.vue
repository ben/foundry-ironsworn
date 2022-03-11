<template>
  <div class="flexcol">
    <header class="sheet-header nogrow">
      <document-img :document="actor" />
      <document-name :document="actor" />
    </header>

    <section class="nogrow">
      <h4 class="clickable text" @click="rollHealth">
        {{ $t('IRONSWORN.Health') }}
      </h4>

      <boxrow
        style="line-height: 25px"
        :min="0"
        :max="5"
        :current="actor.data.health"
        @click="setHealth"
      />
    </section>

    <hr class="nogrow" />

    <section class="flexcol ironsworn__drop__target" data-drop-type="asset">
      <transition-group name="slide" tag="div" class="nogrow">
        <asset
          v-for="asset in assets"
          :key="asset._id"
          :actor="actor"
          :asset="asset"
        />
      </transition-group>
      <div class="flexrow nogrow" style="text-align: center">
        <div class="clickable block" @click="openCompendium">
          <i class="fas fa-atlas" />
          {{ $t('IRONSWORN.Assets') }}
        </div>
      </div>
    </section>

    <hr class="nogrow" />

    <section class="flexrow nogrow">
      <div style="text-align: center">
        <condition-checkbox class="nogrow" :actor="actor" name="battered" />
      </div>
      <div style="text-align: center">
        <condition-checkbox class="nogrow" :actor="actor" name="cursed" />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
  },

  computed: {
    assets() {
      return this.actor.items.filter((x) => x.type === 'asset')
    },
  },

  methods: {
    rollHealth() {
      CONFIG.IRONSWORN.RollDialog.show({
        actor: this.$actor,
        stat: 'health',
      })
    },

    setHealth(_ev, value) {
      this.$actor.update({ data: { health: value } })
    },

    openCompendium() {
      const pack = game.packs?.get('foundry-ironsworn.starforgedassets')
      pack?.render(true)
    },
  },
}
</script>
