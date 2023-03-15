<template>
	<svg
		:height="size ?? '1em'"
		:width="size ?? '1em'"
		role="img"
		aria-hidden="true"
		vector-effect="non-scaling-stroke"
		paint-order="stroke fill"
		:fill="color"
		:stroke="stroke?.color"
		:stroke-width="stroke?.width"
		:class="{
			icon: true
		}">
		<use :href="symbolId" />
	</svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { IronIconProps } from './icon-common'

interface Props extends IronIconProps {} // without this, vue-tsc complains  even though it shouldn't

/**
 * Displays a custom SVG icon from the sprite sheet. Anything in `system/assets/icons` is automatically included as a sprite.
 */
const props = withDefaults(defineProps<Props>(), {
	prefix: 'ironsworn',
	size: '1em',
	color: 'currentColor'
})
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style lang="scss" module>
// FIXME non-scaling stroke effect doesn't seem to work here. what gives?
</style>
