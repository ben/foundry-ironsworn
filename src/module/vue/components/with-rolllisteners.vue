<template>
  <component :is="element">
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    element: String,
  },

  inject: ['$actor'],

  mounted() {
    CONFIG.IRONSWORN.attachInlineRollListeners($(this.$el), {
      actor: this.$actor,
    })

    $(this.$el).find('.entity-link').on('click', this.click)
  },

  methods: {
    click(ev) {
      ev.preventDefault()

      const { pack, id, dfid } = ev.currentTarget.dataset
      if (id) {
        // Might be a move navigation click
        if (!pack) {
          const item = game.items?.get(id)
          return item?.sheet?.render(true)
        }

        const gamePack = game.packs.get(pack)
        gamePack?.getDocument(id)?.then((gameItem) => {
          if (['move', 'sfmove'].includes(gameItem?.type)) {
            this.$emit('moveclick', gameItem)
          }
        })

        return this.$attrs['onMoveclick'] ? false : true
      }

      if (dfid) {
        // Probably an oracle category click
        this.$emit('oracleclick', dfid)
        return this.$attrs['onOracleclick'] ? false : true
      }
    },
  },
})
</script>
