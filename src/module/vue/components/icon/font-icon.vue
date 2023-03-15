<template>
	<component
		:is="el"
		:class="{
			[$style.wrapper]: true,
			[$style.border]: border && !!$style.border,
			[$style.animation]: animation && !!$style.animation,
			...classes
		}"
		:aria-label="label"
		:role="label ? 'img' : 'presentational'"
		:aria-hidden="label ? false : true" />
</template>

<script lang="ts" setup>
import { forEach } from 'lodash-es'
import { computed } from 'vue'
import type { FontAwesomeIconProps } from './icon-common'
import { FontAwesome } from './icon-common'

interface Props extends FontAwesomeIconProps {} // workaround because vue-tsc complains about needing a type literal otherwise

/**
 * A FontAwesome 6 icon.
 */
const props = withDefaults(defineProps<Props>(), {
	family: FontAwesome.Family.Solid,
	style: FontAwesome.Style.Classic,
	fw: true,
	el: 'span'
})

const classes = computed(() => {
	const iconClasses: Record<string, boolean> = {
		icon: true,
		[`fa-${props.name}`]: true
	}
	forEach(props, (value, key) => {
		switch (true) {
			case key === 'title':
			case key === 'icon':
				break
			case key === 'animation' && value:
				;(value as FontAwesomeIconProps['animation'])?.forEach(
					(cls) => (iconClasses[cls] = true)
				)
				break
			case typeof value === 'boolean':
				iconClasses[`fa-${key}`] = value as boolean
				break
			case typeof value === 'string':
				iconClasses[value as string] = true
				break
			default:
				break
		}
	})
	return iconClasses
})
</script>

<style lang="scss" module>
.wrapper {
}

.border {
	// @each $value, $key in v-bind('borderOptions') {
	//   @if $value {
	//     #{$key}: $value;
	//   }
	// }
}

.animation {
	// @each $value, $key in v-bind('animationOptions') {
	//   @if $value {
	//     #{$key}: $value;
	//   }
	// }
}
</style>
