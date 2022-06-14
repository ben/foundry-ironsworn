<template>
  <btn-faicon class="btn-compendium" icon="atlas" @click="openCompendium" aria-haspopup="dialog">
    <slot></slot>
  </btn-faicon>
</template>

<style lang="less"></style>

<script>
export default {
  props: {
    compendium: String,
  },
  methods: {
    async openCompendium() {
      const pack = game.packs?.get(`foundry-ironsworn.${this.compendium}`)
      pack?.render(true)
    },
  },
}
</script>
