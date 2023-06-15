<template>
	<IronBtn
		:data-tooltip="formatRollPlusStat(statLabel, true)"
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
import { computed } from '@vue/reactivity'
import type { ExtractPropTypes } from 'vue'
import { inject } from 'vue'
import type { IronswornActor } from '../../../actor/actor'
import { MeterField } from '../../../fields/MeterField'
import type { IronswornItem } from '../../../item/item'
import { AssetConditionMeterField } from '../../../item/subtypes/asset'
import { IronswornPrerollDialog } from '../../../rolls'
import { formatRollPlusStat } from '../../../rolls/ironsworn-roll-message'
import { pickInjectedDocument } from '../../composable/pickInjectedDocument'
import { $ActorKey, $ItemKey } from '../../provisions'
import IronBtn from './iron-btn.vue'

interface Props extends Omit<ExtractPropTypes<typeof IronBtn>, 'tooltip'> {
	documentType: DocumentType
	/**
	 * The key of the stat value within `system`
	 */
	attr: string
}

const props = defineProps<Props>()
const { document, $document } = pickInjectedDocument(props.documentType)

const field = computed(
	() =>
		$document?.system.schema.getField(props.attr) as
			| AssetConditionMeterField
			| MeterField
			| foundry.data.fields.NumberField
)

const statLabel = computed(() => {
	return (
		document?.value.system[props.attr].name ??
		game.i18n.localize(field.value.label)
	)
})

const $actor = inject($ActorKey, undefined) as
	| IronswornActor<'character'>
	| IronswornActor<'starship'>
	| IronswornActor<'shared'>
	| undefined
const $item = inject($ItemKey, undefined) as IronswornItem<'asset'>

function rollStat(): any {
	if ($actor == null) return
	if (props.documentType === 'Item') {
		// FIXME: this should take `attr` instead to get the value, but there doesn't seem to be a simple way to (de)stringify the path to deeper props like there is with e.g. Actor.update()
		// so, for now, we assume that assets are the only Items that we bother to roll with.
		return IronswornPrerollDialog.showForStat(props.attr, $item, true)
	} else if (props.documentType === 'Actor') {
		return IronswornPrerollDialog.showForStat(props.attr, $actor)
	}
}
</script>
