<template>
	<IronBtn
		:data-tooltip="$t('IRONSWORN.Roll +x', { stat: statLabel })"
		class="action-roll stat-roll"
		aria-haspopup="dialog"
		icon="ironsworn:d10-tilt"
		v-bind="($props, $attrs)"
		@click="rollStat">
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script lang="ts" setup>
import type { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import type { ExtractPropTypes } from 'vue'
import { inject, useSlots } from 'vue'
import { IronswornActor } from '../../../actor/actor'
import { IronswornItem } from '../../../item/item'
import type { AssetDataProperties } from '../../../item/itemtypes.js'
import { IronswornPrerollDialog } from '../../../rolls'
import { $ActorKey, $ItemKey } from '../../provisions'
import IronBtn from './iron-btn.vue'

interface Props extends Omit<ExtractPropTypes<typeof IronBtn>, 'tooltip'> {
	documentType: DocumentType
	/**
	 * This string will be inserted in into the tooltip text "Roll +{x}". It should already be localized.
	 */
	statLabel: string
	attr: string
}

const props = defineProps<Props>()

const $actor = inject($ActorKey, undefined) as
	| IronswornActor<'character'>
	| undefined
const $item = inject($ItemKey, undefined) as IronswornItem<'asset'>

function rollStat(): any {
	if (props.documentType === 'Item') {
		const name = `${props.statLabel} (${$item?.name})`
		// FIXME: this should take `attr` instead to get the value, but there doesn't seem to be a simple way to (de)stringify the path to deeper props like there is with e.g. Actor.update()
		// so, for now, we assume that assets are the only Items that we bother to roll with.
		return IronswornPrerollDialog.showForStat(
			name,
			($item?.data as AssetDataProperties).data.track.current,
			$actor
		)
	} else if (props.documentType === 'Actor') {
		const name = `${props.statLabel} (${$actor?.name})`

		return IronswornPrerollDialog.showForStat(
			name,
			$actor?.system[props.attr],
			$actor
		)
	}
}
</script>
