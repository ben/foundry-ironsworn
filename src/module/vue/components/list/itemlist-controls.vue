<template>
  <fieldset class="item-list-controls">
    <btn-faicon v-for="track in progressTypes" :key="track.name" icon="plus" @click="addProgressItem(track.subtype)">
      {{ $t(`IRONSWORN.${track.i18n}`) }}</btn-faicon
    >
    <btn-compendium v-for="compendium in compendiumTypes" :key="compendium.name" :compendium="compendium.name">
      {{ $t(`IRONSWORN.${compendium.i18n}`) }}</btn-compendium
    >
    <slot></slot>
  </fieldset>
</template>

<style lang="less">
.item-list-controls {
  flex-grow: 0;
  display: flex;
  flex-flow: row nowrap;
  text-align: center;
  align-items: stretch;
  gap: 0.5em;
  & > * {
    flex-basis: 0%;
    flex-grow: 1;
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    progressTypes: {
      type: [{ subtype: String, i18n: String }],
      default: [
        { subtype: 'vow', i18n: 'Vow' },
        { subtype: 'progress', i18n: 'Progress' },
      ],
    },
    compendiumTypes: {
      type: [{ name: String, i18n: String }],
      default: [{ name: 'ironswornfoes', i18n: 'Foes' }],
    },
  },

  methods: {
    async addProgressItem(subtype) {
      let dataSubtype = subtype === 'connection' ? 'bond' : subtype
      const itemData = {
        name: this.$capitalize(subtype),
        type: 'progress',
        data: { subtype: dataSubtype },
        sort: 9000000,
      }
      const item = await Item.create(itemData, { parent: this.$actor })
      item.sheet.render(true)
    },
  },
}
</script>
