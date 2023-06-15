<template>
	<AttrSlider
		class="condition-meter"
		:document-type="documentType"
		:attr="props.attr"
		:slider-style="sliderStyle"
		:read-only="readOnly"
		:global="global">
		<template #label>
			<BtnRollstat
				v-if="labelPosition != 'none'"
				:class="$style.btn"
				tabindex="0"
				:document-type="documentType"
				:vertical="sliderStyle === 'vertical'"
				:attr="props.attr"
				:stat-label="statLabel"
				:text="statLabel" />
		</template>
	</AttrSlider>
</template>

<script setup lang="ts">
import AttrSlider from './attr-slider.vue'
import type { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import BtnRollstat from '../buttons/btn-rollstat.vue'
import { pickInjectedDocument } from '../../composable/pickInjectedDocument'
import { computed } from 'vue'
import { AssetConditionMeterField } from '../../../item/subtypes/asset'
import type { MeterField } from '../../../fields/MeterField'

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
	}>(),
	{
		sliderStyle: 'vertical',
		labelPosition: 'left',
		readOnly: false,
		global: false
	}
)

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
</script>

<style lang="scss" module>
.btn {
	text-transform: uppercase;
}
</style>
