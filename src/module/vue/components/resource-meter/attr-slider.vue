<template>
	<article
		class="attr-slider"
		:class="{ [`label-${labelPosition}`]: true }"
		:aria-labelledby="`${baseId}-label`"
		:aria-orientation="sliderStyle !== 'compact' ? sliderStyle : undefined"
	>
		<section
			v-if="labelPosition != 'none'"
			:id="`${baseId}-label`"
			class="attr-slider-label nogrow"
		>
			<slot name="label">
				<!-- button or static label goes here -->
				<!-- the tabindex for this item should be -1 -->
			</slot>
		</section>
		<slot name="default"></slot>
		<SliderBar
			class="attr-slider-bar"
			:orientation="sliderStyle !== 'compact' ? sliderStyle : undefined"
			:max="max"
			:min="min"
			:soft-max="softMax"
			:value="value"
			:segment-class="segmentClass"
			:read-only="readOnly"
			@change="onChange"
		>
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
		softMax?: number | undefined
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
		softMax: undefined
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
	() => document?.value.system[props.attr].min ?? field.value.fields.min ?? 0
)

const max = computed(() => {
	// @ts-expect-error
	const fieldMax = field.value.max
	const currentMax = document?.value?.system[props.attr].max as
		| number
		| undefined
	if (fieldMax == null) return currentMax as number
	if (currentMax == null) return fieldMax as number
	if (fieldMax > currentMax) return fieldMax as number
	return currentMax
})

const targetKey = computed(() =>
	field.value instanceof foundry.data.fields.NumberField
		? `system.${props.attr}`
		: `system.${props.attr}.value`
)

const value = computed(
	() =>
		foundry.utils.getProperty(document?.value as any, targetKey.value) as number
)

async function onChange(newValue: number) {
	const data = { [targetKey.value]: newValue }

	// redundant with the below if it's global, but fires anyway so that a single message appears in the chatlog.
	await $document?.update({ ...data })
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
