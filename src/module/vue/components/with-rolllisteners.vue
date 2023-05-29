<template>
	<component :is="element" ref="el">
		<slot />
	</component>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, useAttrs } from 'vue'
import type { IronswornActor } from '../../actor/actor'
import { attachInlineRollListeners } from '../../features/rollplus'
import type { IronswornItem } from '../../item/item'
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
		actor: $actor
	})

	$(el.value).on('click', '.content-link', click)
	$(el.value).on('click', '.entity-link', click)
})

const $emit = defineEmits(['moveclick', 'oracleclick'])
const $attrs = useAttrs()

async function click(ev: JQuery.ClickEvent) {
	ev.preventDefault()
	ev.stopPropagation()

	const { uuid, dfid } = ev.currentTarget.dataset
	if (uuid) {
		const gameItem = (await fromUuid(uuid)) as IronswornItem | IronswornActor
		if (gameItem?.type === 'sfmove') {
			$emit('moveclick', gameItem)
			return !!$attrs['onMoveclick']
		}

		// @ts-expect-error
		return gameItem?._onClickDocumentLink?.(ev)
	}

	if (dfid) {
		// TODO: allow for custom oracles
		// Probably an oracle category click
		$emit('oracleclick', dfid)
		return !!$attrs['onOracleclick']
	}
}
</script>
