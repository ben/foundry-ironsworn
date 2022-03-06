<template>
  <component :is="element">
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    element: String,
    actor: Object,
  },
  mounted() {
    const actor = game.actors?.get(this.actor._id)
    CONFIG.IRONSWORN.attachInlineRollListeners($(this.$el), { actor })

    $(this.$el).find('.entity-link').on('click', this.click)
  },

  methods: {
    click(ev) {
      ev.preventDefault()

      const { pack, id } = ev.currentTarget.dataset
      const gamePack = game.packs.get(pack)
      gamePack.getDocument(id).then(gameItem => {
        if (gameItem.type === 'move') {
          this.$emit('moveclick', gameItem)
        }
      })

      return this.$listeners['moveclick'] ? false : true
    },
  },
}
</script>
