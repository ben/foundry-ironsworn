<template>
	<img
		class="document-img"
		:src="document.img"
		:style="style"
		:height="size"
		:width="size"
		@click="click" />
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { $ActorKey, $ItemKey } from '../provisions'
const props = withDefaults(
	defineProps<{
		document: any
		size: string
	}>(),
	{ size: '50px' }
)

const style = computed(() => ({
	width: props.size,
	height: props.size
}))

const $actor = inject($ActorKey, undefined)
const $item = inject($ItemKey, undefined)
function click() {
	const current = props.document.img
	const fp = new FilePicker({
		type: 'image',
		current,
		callback: (img) => {
			const doc = $item ?? $actor
			doc?.update({ img })
		}
	})
	return fp.browse(current)
}
</script>

<style lang="scss">
.document-img {
	cursor: pointer;

	&[src$='.svg'] {
		// tint to ensure that transparent SVGs have adequate contrast
		background-color: var(--ironsworn-color-fg-10);
	}
}
</style>
