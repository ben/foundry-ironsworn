<template>
  <component :is="element" ref="el">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, useAttrs } from 'vue'
import { IronswornActor } from '../../actor/actor'
import { attachInlineRollListeners } from '../../helpers/rolldialog'
import { IronswornItem } from '../../item/item'
import { $ActorKey } from '../provisions'

const props = defineProps<{ element: string }>()

const $actor = inject($ActorKey, undefined)
const el = ref<HTMLElement>()
onMounted(() => {
  if (!el.value) {
    console.error('wtf')
    return
  }

  attachInlineRollListeners($(el.value), {
    actor: $actor,
  })

  $(el.value).find('.content-link').on('click', click)
})

const $emit = defineEmits(['moveclick', 'oracleclick'])
const $attrs = useAttrs()

async function click(ev: JQuery.ClickEvent) {
  ev.preventDefault()
  ev.stopPropagation()

  const { pack, id, dfid } = ev.currentTarget.dataset
  if (id) {
    // TODO: better fallback logic here, allow for custom moves
    // Might be a move navigation click
    if (!pack) {
      const item = game.items?.get(id)
      return item?.sheet?.render(true)
    }

    const gamePack = game.packs.get(pack)
    const gameItem = (await gamePack?.getDocument(id)) as
      | IronswornItem
      | IronswornActor
    if (gameItem && ['move', 'sfmove'].includes(gameItem.type)) {
      $emit('moveclick', gameItem)
    }

    return !!$attrs['onMoveclick']
  }

  if (dfid) {
    // TODO: allow for custom oracles
    // Probably an oracle category click
    $emit('oracleclick', dfid)
    return !!$attrs['onOracleclick']
  }
}
</script>
