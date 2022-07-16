<template>
  <component :is="element" ref="el">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { $ActorKey } from '../provisions'

const props = defineProps<{ element: string }>()

const $actor = inject($ActorKey)
const el = ref<HTMLElement>()
onMounted(() => {
  CONFIG.IRONSWORN.attachInlineRollListeners($(el.value), {
    actor: $actor,
  })
})

function click(ev) {
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
}
</script>
