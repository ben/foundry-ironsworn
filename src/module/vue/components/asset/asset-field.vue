<template>
	<div :class="$style.wrapper" class="flexrow">
		<label :for="`input-${baseId}`" :class="$style.label" class="nogrow">{{
			field.name
		}}</label>
		<input
			:id="`input-${baseId}`"
			v-model="field.value"
			type="text"
			:readonly="!canUpdate"
			:class="$style.value"
			@blur="update" />
	</div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import type { AssetField } from '../../../item/itemtypes'
import { ItemKey } from '../../provisions'

const props = withDefaults(
	defineProps<{
		field: AssetField
		/**
		 * Is the field's value read-only?
		 * @default false
		 */
		readonly?: boolean
		updateFn?: (delta: Partial<AssetField>) => Promise<any>
	}>(),
	{ readonly: false, updateFn: undefined }
)

const asset = inject(ItemKey)

const canUpdate = computed(() => !!props.updateFn && !props.readonly)

const baseId = computed(
	() =>
		`field_${props.field.name}_${canUpdate.value ? 'writeable' : 'readonly'}_${
			asset?.value._id
		}`
)

function update(_: FocusEvent) {
	if (!props.updateFn) return
	props.updateFn(props.field)
}
</script>
<style lang="scss" module>
.wrapper {
	gap: var(--ironsworn-spacer-sm);
	align-items: flex-end;
	border-bottom-width: var(--ironsworn-border-width-md);
	border-bottom-style: solid;
	border-bottom-color: var(--ironsworn-color-thematic);
	line-height: 1;
}
.label {
	margin: 0;
	padding: 0;
	padding-right: var(--ironsworn-spacer-sm);
}

.value {
	flex-grow: 1;
	margin: 0;
	padding: 0 var(--ironsworn-spacer-sm);
	overflow-y: visible;
	line-height: inherit;
	&:not([readonly]) {
		// styles for rendering when editable
	}
	&[readonly] {
		--ironsworn-color-input-bg: transparent;
		--ironsworn-color-input-border: transparent;
		pointer-events: none;
	}
}
</style>
