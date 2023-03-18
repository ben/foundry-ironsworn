<template>
	<component
		v-bind="($attrs, $props)"
		:is="is"
		:class="$style.wrapper"
		:data-ironsworn-drop-type="dropType"
		:data-ironsworn-drop-active="state.active">
		<slot />
	</component>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive } from 'vue'

const props = defineProps<{ is: any; dropType: string }>()

const state = reactive({
	active: false
})

function dragStart(type: string) {
	if (type === props.dropType) state.active = true
}

function dragEnd(type: string) {
	if (type === props.dropType) state.active = false
}

onMounted(() => {
	CONFIG.IRONSWORN.emitter.on('dragStart', dragStart)
	CONFIG.IRONSWORN.emitter.on('dragEnd', dragEnd)
})

onUnmounted(() => {
	CONFIG.IRONSWORN.emitter.off('dragStart', dragStart)
	CONFIG.IRONSWORN.emitter.off('dragEnd', dragEnd)
})
</script>

<style lang="scss" module>
@use 'mixin:fx.scss';

.wrapper {
	--ironsworn-drop-outline-width: 3px;
	--ironsworn-drop-outline-style: dotted;

	// The duration of the transition that starts and ends the animation
	--ironsworn-drop-transition-duration: 0.2s;

	// The duration of the looped pulse animation
	--ironsworn-drop-animation-duration: 0.8s;
	--ironsworn-drop-animation-timing-function: ease-in-out;

	position: relative;
	transition: outline var(--ironsworn-drop-transition-duration) ease;
	outline: 0 var(--ironsworn-drop-outline-style) transparent;

	&::after {
		@include fx.overlay;
		@include fx.accentGradient(20);

		transition: opacity var(--ironsworn-drop-transition-duration) ease;
		visibility: hidden;
		opacity: 0;
		border-radius: inherit;
	}

	&[data-ironsworn-drop-active='true'] {
		outline-offset: calc(-1 * var(--ironsworn-drop-outline-width));
		outline-width: var(--ironsworn-drop-outline-width);
		outline-color: var(--ironsworn-color-fg-warm-30);
		animation: drop-zone-pulsate-outline
			var(--ironsworn-drop-animation-duration)
			var(--ironsworn-drop-animation-timing-function) infinite both;

		&::after {
			visibility: visible;
			opacity: 1;
			background-blend-mode: screen;
			animation: drop-zone-pulsate-gradient
				var(--ironsworn-drop-animation-duration)
				var(--ironsworn-drop-animation-timing-function) infinite both;
		}
	}
}

@keyframes drop-zone-pulsate-outline {
	0% {
		outline-offset: calc(-1 * var(--ironsworn-drop-outline-width));
	}

	50% {
		outline-offset: calc(-2 * var(--ironsworn-drop-outline-width));
	}

	100% {
		outline-offset: calc(-1 * var(--ironsworn-drop-outline-width));
	}
}

@keyframes drop-zone-pulsate-gradient {
	0% {
		opacity: 1;
	}

	50% {
		opacity: 0.5;
	}

	100% {
		opacity: 1;
	}
}
</style>
