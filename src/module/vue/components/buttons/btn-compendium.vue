<template>
  <faicon-button class="btn-compendium" icon="atlas" @click="openCompendium">
    <slot></slot>
  </faicon-button>
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
