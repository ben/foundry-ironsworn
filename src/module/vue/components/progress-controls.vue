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
    <btn-compendium class="block" :compendium="ironswornfoes">
      {{ $t('IRONSWORN.Foes') }}
    </btn-compendium>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
    foeCompendium: {
      type: String,
      default: 'ironswornfoes',
    },
  },

  methods: {
    async addProgressItem(subtype) {
      const itemData = {
        name: this.$capitalize(subtype),
        type: 'progress',
        data: { subtype },
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
