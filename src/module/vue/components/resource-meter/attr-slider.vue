<template>
	<article
		:class="{
			[$style[`label${labelPosition.capitalize()}`]]: true,
			[$style.wrapper]: true
		}"
		:aria-labelledby="`${baseId}-label`"
		:aria-orientation="sliderStyle !== 'compact' ? sliderStyle : undefined">
		<section
			v-if="labelPosition != 'none'"
			:id="`${baseId}-label`"
			class="nogrow"
			:class="$style.label">
			<slot name="label">
				<!-- button or static label goes here -->
				<!-- the tabindex for this item should be -1 -->
			</slot>
		</section>
		<slot name="default"></slot>
		<SliderBar
			:class="[$style.bar, barClass]"
			:orientation="sliderStyle !== 'compact' ? sliderStyle : undefined"
			:bar-max="barMax"
			:bar-min="barMin"
			:min="min"
			:max="max"
			:value="value"
			:disabled="disabled"
			:segment-class="segmentClass"
			:read-only="readOnly"
			@change="onChange">
			<template #start>
				<slot name="sliderStart"></slot>
			</template>

			<template #end>
				<slot name="sliderEnd"></slot>
			</template>
		</SliderBar>
	</article>
</template>

<script lang="ts" setup>
/**
 * A slider that controls the value of an attribute.
 */
import type { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import { computed } from 'vue'
import type { MeterField } from '../../../fields/MeterField'
import { IronswornSettings } from '../../../helpers/settings.js'
import type { AssetConditionMeterField } from '../../../item/subtypes/asset'
import { pickInjectedDocument } from '../../composable/pickInjectedDocument.js'
import SliderBar from './slider-bar.vue'

const props = withDefaults(
	defineProps<{
		/**
		 * The key of the attribute controlled by the slider (within `system`). This is the property of the injected document that will be controlled.
		 */
		attr: string
		/**
		 * The maximum value to be shown on the bar, if it differs from the attribute's `max` property
		 */
		barMax?: number | undefined

		/**
		 * The minimum value to be shown on the bar, if it differs from the attribute's `min` property
		 */
		barMin?: number | undefined
		/** The bar's maximum selectable value. Default: inferred from field `max` */
		max?: number | undefined
		/** The bar's minimum selectable value. Default: inferred from field `min`, or 0 if there isn't one. */
		min?: number | undefined
		/**
		 * The type of injectable document to use. Currently only "Actor" and "Item" work - they'll target `ActorKey`/`$ActorKey` or `ItemKey`/`$ItemKey` as appropriate.
		 * @see {$ActorKey}
		 * @see {$ItemKey}
		 */
		documentType: DocumentType
		/**
		 * When 'true' and documentType is set to "Actor", updates *all* actors of the 'shared' and 'character' types.
		 */
		global?: boolean
		sliderStyle?: 'vertical' | 'horizontal' | 'compact'
		labelPosition?: 'right' | 'left' | 'none'
		/**
		 * @see {@link sliderBar} props for more info
		 */
		segmentClass?: Record<number, any> | undefined
		labelClass?: any
		barClass?: any
		readOnly?: boolean
		disabled?: boolean
	}>(),
	{
		global: false,
		readOnly: false,
		sliderStyle: 'vertical',
		labelPosition: 'left',
		labelClass: undefined,
		segmentClass: undefined,
		sliderClass: undefined,
		max: undefined,
		min: undefined,
		barMax: undefined,
		barMin: undefined,
		barClass: undefined
	}
)

const { $document, document } = pickInjectedDocument(props.documentType)

const baseId = computed(() => {
	return `${document?.value?._id}-attr-slider-${props.attr}`
})

const field = computed(
	() =>
		$document?.system.schema.getField(props.attr) as
			| AssetConditionMeterField
			| MeterField
)

const min = computed(
	() =>
		(props.min ??
			document?.value.system[props.attr].min ??
			field.value.fields.min.min ??
			0) as number
)

const max = computed(
	() =>
		(props.max ??
			document?.value?.system[props.attr].max ??
			field.value.fields.max.max) as number
)

const value = computed(
	() =>
		getProperty(document?.value as any, `system.${props.attr}.value`) as number
)

async function onChange(newValue: number) {
	const data = { [`system.${props.attr}.value`]: newValue }

	// console.log('updating with data', data)
	// redundant with the below if it's global, but fires anyway so that a single message appears in the chatlog.
	await $document?.update(data)
	if (props.global) {
		await IronswornSettings.updateGlobalAttribute(data)
	}
}
</script>

<style lang="scss" module>
.wrapper {
	--ironsworn-segment-border-width: var(--ironsworn-border-width-md);
	--ironsworn-segment-border-radius: var(--ironsworn-border-radius-lg);

	display: grid;
	place-items: start;
}

.labelNone {
	grid-template-areas: 'bar';
}
.labelLeft {
	grid-template-areas: 'label bar';
	grid-template-columns: max-content 1fr;
}
.labelRight {
	grid-template-areas: 'bar label';
	grid-template-columns: 1fr max-content;
}
.bar {
	grid-area: bar;
	[aria-orientation='horizontal'] & {
		width: 100%;
		height: 100%;
	}
}
.label {
	display: flex;
	grid-area: label;
	text-transform: uppercase;
	line-height: 1 !important;

	> * {
		align-items: center;
	}
	> label {
		// for e.g. asset browser cards, which don't use a button
		display: flex;
	}

	[aria-orientation='vertical'] & {
		max-height: 50%;
	}
	[aria-orientation='horizontal'] & {
		height: 100%;
		> * {
			padding-inline-end: var(--ironsworn-segment-border-radius);
			height: 100%;
		}
	}
}
</style>
