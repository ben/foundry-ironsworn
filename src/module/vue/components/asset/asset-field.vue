<template>
	<div :class="$style.wrapper">
		<label :class="$style.label">{{ field.name }}</label>
		<input
			v-model="field.value"
			:class="$style.value"
			type="text"
			:readonly="readonly"
			@blur="saveFields" />
	</div>
</template>

<script lang="ts" setup>
import { $ItemKey, ItemKey } from '../../../../module/vue/provisions'
import type { ComputedRef } from 'vue'
import { inject } from 'vue'

defineProps<{
	field: { name: string; value: string }
	readonly?: boolean
}>()

const $asset = inject($ItemKey)
const asset = inject(ItemKey) as ComputedRef

function saveFields() {
	const fields = asset.value?.system.fields
	$asset?.update({ system: { fields } })
}
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
}
</style>
