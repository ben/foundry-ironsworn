<template>
  <div class="flexrow nogrow" style="text-align: center">
    <div class="clickable block" @click="addProgressItem('vow')">
      <i class="fas fa-plus"></i>
      {{ $t('IRONSWORN.Vow') }}
    </div>
    <div class="clickable block" @click="addProgressItem('progress')">
      <i class="fas fa-plus"></i>
      {{ $t('IRONSWORN.Progress') }}
    </div>
    <div class="clickable block" @click="openCompendium('ironswornfoes')">
      <i class="fas fa-atlas"></i>
      {{ $t('IRONSWORN.Foes') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
  },

  methods: {
    async addProgressItem(type) {
      const itemData = {
        name: this.$capitalize(type),
        type,
        sort: 9000000,
      }
      const item = await Item.create(itemData, { parent: this.$actor })
      item.sheet.render(true)
    },

    openCompendium(name) {
      const pack = game.packs?.get(`foundry-ironsworn.${name}`)
      pack?.render(true)
    },
  },
}
</script>
