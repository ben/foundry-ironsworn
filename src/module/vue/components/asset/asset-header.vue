<template>
	<header :class="$style.wrapper">
		<slot></slot>
		<IronIcon
			v-if="decoName"
			:name="decoName"
			:color="color"
			:class="$style.deco"
			tabindex="0"
			role="presentational" />
	</header>
</template>

<script lang="ts" setup>
import IronIcon from '../icon/iron-icon.vue'

const props = defineProps<{
	decoName?: string
	decoHeightCollapsed?: string
	decoHeightExpanded?: string
	decoAspectRatio?: string
	color: string
}>()
</script>

<style lang="scss" module>
.deco {
	pointer-events: none;
}
.starforged {
	// This seems wrong, but imports. See https://github.com/vitejs/vite/issues/7651

	--ironsworn-asset-deco: url('/../../../system/assets/misc/hex-deco.svg');
	--ironsworn-asset-deco-expanded-height: 50px;
	--ironsworn-asset-deco-collapsed-height: 32px;
	--ironsworn-asset-deco-aspect-ratio: calc(24 / 28);

	position: relative;

	&::before {
		display: block;
		position: absolute;
		top: calc(var(--ironsworn-asset-deco-collapsed-height) * -0.09);
		right: calc(var(--ironsworn-asset-deco-collapsed-height) * 0.03);
		transform: scaleX(-1);
		z-index: auto;
		background: var(--ironsworn-color-thematic);
		height: var(--ironsworn-asset-deco-collapsed-height);
		content: '';
		pointer-events: none;
		mask-image: var(--ironsworn-asset-deco);
		aspect-ratio: var(--ironsworn-asset-deco-aspect-ratio);
		mask-repeat: no-repeat;
	}

	& > * {
		z-index: 2;
	}

	.asset-header {
		padding-right: calc(
			var(--ironsworn-asset-deco-collapsed-height) *
				var(--ironsworn-asset-deco-aspect-ratio)
		);
	}
}

.ironsworn {
	--ironsworn-asset-deco: none;
	--ironsworn-asset-deco-expanded-height: 0;
	--ironsworn-asset-deco-collapsed-height: 0;
}

.wrapper {
	gap: var(--ironsworn-spacer-lg);
	align-items: center;

	.asset-expand-toggle {
		display: flex;
		flex-flow: row wrap;
		gap: var(--ironsworn-spacer-lg);
		transition: var(--ironsworn-transition);
		box-shadow: none !important;
		background: none;
	}

	.asset-title {
		transition: inherit;
		margin: 0;
		text-transform: uppercase;
		line-height: 1;
		word-spacing: var(--ironsworn-word-spacing-sm);
		letter-spacing: var(--ironsworn-letter-spacing-sm);
		font-size: var(--font-size-14);
		font-weight: bold;
	}

	.asset-type {
		flex-grow: 0;
		transition: inherit;
		line-height: 1;
		color: var(--ironsworn-color-thematic);
		font-style: italic;
	}

	.asset-controls {
		display: flex;
		flex-grow: 0;
		flex-wrap: nowrap;
		justify-items: flex-end;
	}
}
</style>
