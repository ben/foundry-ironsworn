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
      if (!pack) {
        const item = game.items?.get(id)
        return item?.sheet?.render(true)
      }

      const gamePack = game.packs.get(pack)
      gamePack?.getDocument(id)?.then((gameItem) => {
        if (['move', 'sfmove'].includes(gameItem.type)) {
          this.$emit('moveclick', gameItem)
        }
      })

      return this.$listeners['moveclick'] ? false : true
    },
  },
}
</script>
