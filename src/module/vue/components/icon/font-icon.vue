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
import { FontAwesomeIconProps, FontAwesome } from './icon-common'

/**
 * A FontAwesome 6 icon.
 */
const props = withDefaults(defineProps<FontAwesomeIconProps>(), {
	family: FontAwesome.Family.Solid,
	style: FontAwesome.Style.Classic,
	el: 'span'
})

const classes = computed(() => {
	const iconClasses: Record<string, boolean> = {
		icon: true,
		fa: true,
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
	display: flex;
	align-content: center;
	justify-content: center;
	align-items: center;
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
