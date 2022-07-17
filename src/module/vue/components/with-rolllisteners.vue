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
  if (!el.value) {
    console.error('wtf')
    return
  }

  CONFIG.IRONSWORN.attachInlineRollListeners($(el.value), {
    actor: $actor,
  })

  $(el.value).find('.entity-link').on('click', click)
})

const $emit = defineEmits(['moveclick', 'oracleclick'])
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
        $emit('moveclick', gameItem)
      }
    })

    return this.$attrs['onMoveclick'] ? false : true
  }

  if (dfid) {
    // Probably an oracle category click
    $emit('oracleclick', dfid)
    return this.$attrs['onOracleclick'] ? false : true
  }
}
</script>
