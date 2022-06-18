<template>
  <div class="flexrow nogrow" style="text-align: center">
    <btn-faicon class="block" icon="plus" @click="addProgressItem('vow')">
      {{ $t('IRONSWORN.Vow') }}</btn-faicon
    >
    <btn-faicon class="block" icon="plus" @click="addProgressItem('progress')">
      {{ $t('IRONSWORN.Progress') }}</btn-faicon
    >
    <btn-compendium class="block" :compendium="foeCompendium">
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
