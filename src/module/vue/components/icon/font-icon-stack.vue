<template>
	<component
		:is="el"
		:class="{ [$style.wrapper]: true, 'fa-stack': true }"
		:aria-label="label"
		:role="label ? 'img' : 'presentational'"
		:aria-hidden="label ? false : true">
		<slot>
			<Icon class="fa-stack-2x" v-bind="bgOptions" />
			<Icon class="fa-stack-1x" v-bind="fgOptions" />
		</slot>
	</component>
</template>

<script lang="ts" setup>
import type FontIcon from './font-icon.vue'
import Icon from './icon-helpers.vue'

interface IconStackLayerOptions
	extends Omit<PropsOf<typeof FontIcon>, 'size' | 'label'> {}

interface IconStackOptions
	extends Omit<
		PropsOf<typeof FontIcon>,
		'icon' | 'stack' | 'family' | 'style'
	> {
	bgOptions?: IconStackLayerOptions
	fgOptions?: IconStackLayerOptions
}

const props = withDefaults(defineProps<IconStackOptions>(), {})
</script>

<style lang="scss" module>
.wrapper {
	// TODO
}
</style>
