<template>
	<article class="flexrow xp-track nogrow">
		<button
			v-for="(box, i) in computedBoxes"
			:key="box.key"
			class="xp-box"
			type="button"
			:class="box.classes"
			@mouseover="hovered = i"
			@mouseleave="hovered = -1"
			@click="click(i)" />
	</article>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = defineProps<{
	max: number
	marked: number
}>()

const hovered = ref(-1)

interface Box {
	key: string
	classes: {
		hover: boolean
		selected: boolean
	}
}

const computedBoxes = computed(() => {
	const ret = [] as Box[]
	for (let i = 0; i < props.max; i++) {
		ret.push({
			key: `box${i}`,
			classes: {
				hover: hovered.value >= i,
				selected: props.marked >= i + 1
			}
		})
	}
	return ret
})

const $emit = defineEmits<{ click: [number] }>()
function click(i) {
	if (i === 0 && props.marked === 1) {
		i = -1
	}
	$emit('click', i + 1)
}
</script>
<style lang="scss" scoped>
@use 'mixin:clickable.scss';
.xp-track {
	.xp-box {
		// for sizing/layout concerns, see legacy-track.vue
		--ironsworn-color-clickable-block-bg: var(--ironsworn-color-bg);
		--ironsworn-color-clickable-block-border: var(--ironsworn-color-border);
		--ironsworn-color-clickable-block-bg-hover: var(--ironsworn-color-bg);
		--ironsworn-color-clickable-block-bg-selected: var(
			--ironsworn-color-thematic
		);

		@include clickable.block(var(--ironsworn-legacy-xp-box-size));

		border-style: solid;
		border-radius: var(--ironsworn-border-radius-md);
		aspect-ratio: 1;

		&:hover,
		&.hover {
			border-color: var(
				--ironsworn-color-clickable-block-border-hover
			) !important;
			// legacy-xp-box-size is set in legacy-track.vue
			box-shadow: inset 0 0 var(--ironsworn-legacy-xp-box-size, 15px)
				var(--ironsworn-color-thematic) !important;

			&[aria-selected='true'],
			&.selected,
			&.active {
				@include clickable.blockHover(var(--ironsworn-legacy-xp-box-size));

				&:first-child {
					@include clickable.block;
				}
			}

			& ~ .xp-box {
				@include clickable.block;
			}
		}
	}
}
</style>
