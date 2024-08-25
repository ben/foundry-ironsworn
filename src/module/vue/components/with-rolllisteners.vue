<template>
	<component :is="element" ref="el">
		<slot />
	</component>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import type { IronswornActor } from '../../actor/actor'
import { attachInlineRollListeners } from '../../features/rollplus'
import type { IronswornItem } from '../../item/item'
import { $ActorKey } from '../provisions'
import { OracleTable } from '../../roll-table/oracle-table'

const props = defineProps<{ element: string }>()

const $actor = inject($ActorKey, undefined) as
	| IronswornActor<'character'>
	| undefined
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

async function click(ev: JQuery.ClickEvent) {
	ev.preventDefault()
	ev.stopPropagation()

	let { uuid, dfid, dsid } = ev.currentTarget.dataset
	if (uuid) {
		const gameItem = (await fromUuid(uuid)) as any
		if (gameItem?.type === 'sfmove') {
			CONFIG.IRONSWORN.emitter.emit('highlightMove', gameItem.uuid)
			return true
		}

		if (gameItem instanceof OracleTable) {
			CONFIG.IRONSWORN.emitter.emit(
				'highlightOracle',
				gameItem.flags['foundry-ironsworn']?.dsid
			)
			return true
		}

		// @ts-expect-error
		return gameItem?._onClickDocumentLink?.(ev)
	}

	// if (dfid && !dsid) {
	// 	// Try to convert to a Datasworn ID
	// 	dsid = LegacyToDataswornIds[dfid]
	// }

	if (dsid) {
		// TODO: allow for custom oracles
		// Probably an oracle category click
		CONFIG.IRONSWORN.emitter.emit('highlightOracle', dsid)
		ev.stopImmediatePropagation()
		return true
	}
}
</script>
