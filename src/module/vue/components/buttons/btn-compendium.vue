<template>
  <icon-button class="btn-compendium" icon="atlas" @click="openCompendium">
    <!-- {{ $t('IRONSWORN.Assets') }} -->
    <slot></slot>
  </icon-button>
</template>

<style lang="less"></style>

<script>
export default {
  props: {
    compendium: String,
  },
  methods: {
    async openCompendium() {
      const pack = await game.packs?.get(`foundry-ironsworn.${this.compendium}`)
      pack?.render(true)
    },
  },
}
</script>
