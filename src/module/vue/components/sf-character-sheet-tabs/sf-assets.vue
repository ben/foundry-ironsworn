<template>
  <div class="flexcol ironsworn__drop__target" data-drop-type="asset">
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
    openCompendium() {
      const pack = game.packs?.get('foundry-ironsworn.starforgedassets')
      pack?.render(true)
    },
  },
}
</script>
