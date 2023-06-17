<template>
	<article
		class="attr-slider"
		:class="{ [`label-${labelPosition}`]: true }"
		:aria-labelledby="`${baseId}-label`"
		:aria-orientation="sliderStyle !== 'compact' ? sliderStyle : undefined">
		<section
			v-if="labelPosition != 'none'"
			:id="`${baseId}-label`"
			class="attr-slider-label nogrow">
			<slot name="label">
				<!-- button or static label goes here -->
				<!-- the tabindex for this item should be -1 -->
			</slot>
		</section>
		<slot name="default"></slot>
		<SliderBar
			class="attr-slider-bar"
			:orientation="sliderStyle !== 'compact' ? sliderStyle : undefined"
			:bar-max="barMax"
			:bar-min="barMin"
			:min="min"
			:max="max"
			:value="value"
			:segment-class="segmentClass"
			:read-only="readOnly"
			@change="onChange">
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
import NumberField from '../../../fields/types/NumberField'
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
		readOnly?: boolean
	}>(),
	{
		global: false,
		readOnly: false,
		sliderStyle: 'vertical',
		labelPosition: 'left',
		segmentClass: undefined,
		max: undefined,
		min: undefined,
		barMax: undefined,
		barMin: undefined
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

<style lang="scss">
.attr-slider {
	--ironsworn-segment-border-width: var(--ironsworn-border-width-md);
	--ironsworn-segment-border-radius: var(--ironsworn-border-radius-lg);

	&[aria-orientation='vertical'] {
		display: grid;
		grid-template-rows: max-content max-content max-content;
		grid-template-columns: max-content max-content;
		grid-auto-flow: column;
		place-items: start;

		.attr-slider-label {
			grid-row: 1;
			max-height: 50%;
		}

		.attr-slider-bar {
			grid-row: 1;
		}

		&.label-none {
			display: flex;
		}

		&.label-left {
			.attr-slider-label {
				grid-column: 1;
			}
		}

		&.label-right {
			.attr-slider-label {
				grid-column: 2;
			}
		}
	}

	&[aria-orientation='horizontal'] {
		display: flex;
		flex-flow: row wrap;
		justify-items: space-between;

		.attr-slider-label {
			> * {
				height: 100%;

				padding-inline-end: var(--ironsworn-segment-border-radius);
			}
		}
	}
	.attr-slider-label {
		line-height: 1 !important;
		text-transform: uppercase;
		display: flex;

		> * {
			align-items: center;
		}
		> label {
			// for e.g. asset browser cards, which don't use a button
			display: flex;
		}
	}
}
</style>
