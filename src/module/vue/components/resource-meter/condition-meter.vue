<template>
	<AttrSlider
		class="condition-meter"
		:class="{ [$style.wrapper]: true }"
		:document-type="documentType"
		:attr="props.attr"
		:slider-style="sliderStyle"
		:read-only="readOnly"
		:global="global"
		:disabled="isLocked">
		<template #label>
			<BtnRollstat
				v-if="labelPosition != 'none'"
				:class="[$style.btn, labelClass]"
				tabindex="0"
				:data-tooltip-direction="labelPosition.toUpperCase()"
				:document-type="documentType"
				:vertical="sliderStyle === 'vertical'"
				:attr="props.attr"
				:text="statLabel" />
		</template>
		<template #bar="{ onChange, ...barAttributes }">
			<Transition name="fade">
				<div v-if="isLocked" :class="$style.lockOverlay" role="presentational">
					<FontIcon
						name="cancel"
						:size="FontAwesome.Size['xl']"
						:class="$style.lockIcon" />
				</div>
				<SliderBar
					v-bind="barAttributes"
					:class="$style.lockableBar"
					:data-tooltip="isLocked ? lockedTooltip : null"
					@change="onChange" />
			</Transition>
		</template>
	</AttrSlider>
</template>

<script setup lang="ts">
import AttrSlider from './attr-slider.vue'
import type { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import BtnRollstat from '../buttons/btn-rollstat.vue'
import { pickInjectedDocument } from '../../composable/pickInjectedDocument'
import { computed, inject } from 'vue'
import type { AssetConditionMeterField } from '../../../item/subtypes/asset'
import type { MeterField } from '../../../fields/MeterField'
import FontIcon from '../icon/font-icon.vue'
import { $ActorKey, ActorKey } from '../../provisions'
import { FontAwesome } from '../icon/icon-common'
import SliderBar from './slider-bar.vue'

const props = withDefaults(
	defineProps<{
		/**
		 * The key of the attribute (within `system`) controlled by the slider. This is the property of the injected document that will be controlled.
		 */
		attr: string
		/**
		 * The type of injectable document to use. Currently only "Actor" and "Item" work - they'll target `$ActorKey` or `$ItemKey` as appropriate.
		 *
		 * @see {$ActorKey}
		 * @see {$ItemKey}
		 */
		documentType: DocumentType
		/**
		 * When 'true' and documentType is set to "Actor", updates *all* actors of the 'shared' and 'character' types.
		 */
		global?: boolean
		sliderStyle?: 'vertical' | 'horizontal'
		labelPosition?: 'right' | 'left' | 'none'
		readOnly?: boolean
		labelClass?: any
	}>(),
	{
		sliderStyle: 'vertical',
		labelPosition: 'left',
		labelClass: undefined,
		readOnly: false,
		global: false
	}
)

const { document, $document } = pickInjectedDocument(props.documentType)
const $actor = inject($ActorKey, undefined)
const actor = inject(ActorKey, undefined)

const field = computed(
	() =>
		$document?.system.schema.getField(props.attr) as
			| AssetConditionMeterField
			| MeterField
)

const isLocked = computed(
	() => document?.value.system[props.attr]?.noRecover as boolean | undefined
)

const statLabel = computed(() => {
	return (
		document?.value.system[props.attr].name ??
		game.i18n.localize(field.value.label)
	)
})

const lockedBy = computed(() => {
	if (actor == null) return
	return actor.value.effects.find((fx) =>
		fx.flags['foundry-ironsworn']?.noRecover?.endsWith(
			props.attr.split('.').pop() as string
		)
	)
})

const lockedTooltip = computed(() => {
	if (lockedBy.value == null) return
	const message = game.i18n.format('IRONSWORN.IMPACT.NoRecoverHint', {
		resource: statLabel.value,
		status: (lockedBy.value as any).name
	})
	return `
  <img src='${lockedBy.value.icon}' height='3em' width='3em' style='float: left; padding-right: 0.5em;'>
  <p>${message}</p>`
})
</script>

<style lang="scss" module>
@use 'mixin:text.scss';

.wrapper {
	--ironsworn-bar-locked-color: var(--ironsworn-color-danger);
	--ironsworn-bar-locked-opacity: 0.5;

	position: relative;
}

.btn {
	text-transform: uppercase;
}
.lockableBar {
	&[aria-disabled='true'] {
		opacity: var(--ironsworn-bar-locked-opacity);
		background-color: var(--ironsworn-bar-locked-color);
		overflow: clip;
	}
}

.lockOverlay {
	display: flex;
	position: absolute;
	top: 0;
	left: 0;
	grid-area: bar;
	align-items: center;
	justify-content: center;
	z-index: var(--ironsworn-z-index-higher);
	width: 100%;
	height: 100%;
	pointer-events: none;
}

.lockIcon {
	--ironsworn-color-text-stroke: var(--ironsworn-color-bg);

	@include text.stroke;
}
</style>
