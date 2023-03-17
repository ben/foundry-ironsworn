<template>
	<header :class="$style.wrapper">
		<slot name="default" v-bind="{ headerStyles: $style }"></slot>
		<svg
			v-if="decoName"
			:name="decoName"
			:class="$style.deco"
			tabindex="0"
			role="presentational"
			aria-hidden="true"
			height="24"
			width="28"
			fill="currentColor">
			<use :href="`#ironsworn-${decoName}`" />
		</svg>
	</header>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { IronswornSettings } from '../../../helpers/settings'
import IronIcon from '../icon/iron-icon.vue'

// const props = defineProps<{}>()

const decoName = computed(() => {
	if (IronswornSettings.starforgedToolsEnabled) {
		return 'hex-deco'
	}
	return undefined
})
</script>

<style lang="scss" module>
.wrapper {
	position: relative;
	gap: var(--ironsworn-spacer-lg);
	align-items: center;
}

.deco {
	z-index: 2;
	color: var(--ironsworn-color-thematic);
	pointer-events: none;
	aspect-ratio: calc(24 / 28);
	height: 28px;
	width: 24px;
	flex: unset;
	margin: calc(-1 * var(--ironsworn-spacer-xs));
}

.toggle {
	display: flex;
	flex-flow: row wrap;
	gap: var(--ironsworn-spacer-lg);
	transition: var(--ironsworn-transition);
	box-shadow: none !important;
	background: none;
}

.title {
	transition: inherit;
	margin: 0;
	text-transform: uppercase;
	line-height: 1;
	word-spacing: var(--ironsworn-word-spacing-sm);
	letter-spacing: var(--ironsworn-letter-spacing-sm);
	font-size: var(--font-size-14);
	font-weight: bold;
}

.type {
	flex-grow: 1;
	transition: inherit;
	line-height: 1;
	color: var(--ironsworn-color-thematic);
	font-style: italic;
	text-align: left;
}

.controls {
	display: flex;
	flex-grow: 0;
	flex-wrap: nowrap;
	justify-items: flex-end;
}
</style>
