<template>
	<div :class="$style.wrapper">
		<label :for="`input-${baseId}`" :class="$style.label">{{
			field.name
		}}</label>
		<input
			:id="`input-${baseId}`"
			v-model="field.value"
			type="text"
			:readonly="canUpdate"
			:class="$style.value" />
	</div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import type { AssetField } from '../../../item/itemtypes'
import { ItemKey } from '../../provisions'

const props = withDefaults(
	defineProps<{
		field: AssetField
		readonly?: boolean
		updateFn?: (delta: Partial<AssetField>) => Promise<any>
	}>(),
	{ readonly: false, updateFn: undefined }
)

const asset = inject(ItemKey) as Ref

const canUpdate = computed(() => !!props.updateFn && !props.readonly)

const baseId = computed(() => `field_${props.field.name}_${asset.value?._id}`)
</script>
<style lang="scss" module>
.wrapper {
	display: flex;
	flex-direction: row;
	flex-grow: 0;
	gap: var(--ironsworn-spacer-sm);
	border-bottom-width: var(--ironsworn-border-width-md);
	border-bottom-style: solid;
	border-bottom-color: var(--ironsworn-color-thematic);
}
.label {
	margin: 0;
	padding: 0;
}

.value {
	flex-grow: 1;
	margin: 0;
	padding: 0 var(--ironsworn-spacer-sm);
	&[readonly='true'] {
		border: none;
		background: none;
	}
	&[readonly='false'] {
	}
}
</style>
