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
import type { IconPropsCommon } from './icon-common'
import { FontAwesome } from './icon-common'

interface FontAwesomeIconProps extends IconPropsCommon {
	/**
	 * @default `span`
	 */
	el?: any
	name: FontAwesome.Name
	family?: FontAwesome.Family
	/**
	 * @remarks FVTT doesn't actually provide the FA6 sharp icons, so this shouldn't be used yet.
	 */
	style?: FontAwesome.Style
	/**
	 * Unlabelled content is inaccessible, and will be rendered indicating as such so that screen readers don't try to read icon font glyphs.
	 *
	 * This can also be omitted if a tooltip or other label is provided for a parent component, like with most buttons.
	 */
	label?: string
	/**
	 * @see
	 */
	border?: boolean
	/**
	 * NYI
	 */
	borderOptions?: FontAwesome.Border.Options
	/**
	 * Rether to render the item at a fixed width.
	 * @default true
	 */
	fw?: boolean // fa-fw
	/**
	 * For duotone icons only.
	 */
	'swap-opacity'?: boolean // fa-swap-opacity
	/**
	 * @see https://fontawesome.com/docs/web/style/lists
	 */
	li?: boolean
	inverse?: boolean
	rotate?: FontAwesome.Rotate
	size?: FontAwesome.Size
	pull?: FontAwesome.Pull
	animation?: FontAwesome.Animation[]
	/**
	 * NYI
	 */
	animationOptions?: FontAwesome.Animation.Options
	/**
	 * Used with {@link FontIconStack}.
	 */
	stack?: 'stack-1x' | 'stack-2x'
}

/**
 * A FontAwesome 6 icon.
 */
const props = withDefaults(defineProps<FontAwesomeIconProps>(), {
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
