<template>
	<Collapsible
		ref="$collapsible"
		class="list-block"
		:class="$style.wrapper"
		:toggle-button-class="$style.toggleBtn"
		:toggle-tooltip="$enrichMarkdown(category.dataforgedCategory?.Description)"
		:toggle-wrapper-is="`h${headingLevel}`"
		:toggle-wrapper-class="$style.toggleWrapper"
		:toggle-section-class="`${$style.toggleSection} list-block-header`"
		:base-id="`move_category_${snakeCase(category.displayName)}`"
		:toggle-label="category.displayName"
		:toggle-text-class="$style.toggleText"
	>
		<template #default>
			<ul class="flexcol" :class="$style.list">
				<li
					v-for="(move, i) of category.moves"
					:key="i"
					class="list-block-item nogrow"
					:class="$style.listItem"
				>
					<IndexedMoveRow
						ref="$children"
						:move="move"
						:heading-level="headingLevel + 1"
						:class="$style.moveRow"
						thematic-color="transparent"
						@afterExpand="afterMoveExpand"
					/>
				</li>
			</ul>
		</template>
	</Collapsible>
</template>

<script setup lang="ts">
import type { IndexedMoveCategory } from '../../features/custommoves.js'
import { snakeCase } from 'lodash-es'

import Collapsible from './collapsible/collapsible.vue'
import IndexedMoveRow from './sf-indexed-move-row.vue'

const props = withDefaults(
	defineProps<{
		category: IndexedMoveCategory
		highlightDuration?: number
		headingLevel?: number
		collapsible?: Omit<
			PropsOf<typeof Collapsible>,
			| 'toggleButtonClass'
			| 'toggleTooltip'
			| 'toggleWrapperIs'
			| 'toggleWrapperClass'
			| 'toggleSectionClass'
			| 'baseId'
			| 'toggleLabel'
			| 'toggleTextClass'
		>
	}>(),
	{ headingLevel: 3, highlightDuration: 2000 }
)
</script>

<style lang="scss" module>
@use 'mixin:fx.scss';
@use 'mixin:clickable.scss';

.wrapper {
	--ironsworn-color-text-stroke: var(--ironsworn-color-dark);
	--ironsworn-color-thematic: v-bind('category?.color');
	border-radius: var(--ironsworn-border-radius-lg);
	border: var(--ironsworn-border-width-lg) solid var(--ironsworn-color-thematic);
	border-left-width: 10px;
}

.list {
	display: flex;
	flex-flow: column nowrap;
	margin: 0;
	padding: 0;
	list-style: none;
}

.toggleWrapper {
	box-sizing: content-box;
}

.toggleSection {
	box-sizing: content-box;
	border-radius: var(--ironsworn-border-radius-lg);

	button {
		--ironsworn-color-clickable-text: var(--ironsworn-color-fg);
		--ironsworn-color-clickable-text-hover: var(--ironsworn-color-fg-warm);
		@include clickable.text;

		height: inherit;
	}
}

.toggleBtn {
	background: none;
}

.listItem {
	//
}

.moveRow {
	&:focus {
		border: 0;
		box-shadow: none;
		// outline: var(--ironsworn-border-width-md) solid var(--ironsworn-color-cool);
		// box-shadow: var(--ironsworn-box-shadow-highlight) !important;
		// TODO: figure out a better way to convey focus here.
		background-color: transparent;
	}

	&[data-highlighted='true']::after {
		@include fx.overlay;
		@include fx.accentGradient(50);

		opacity: 0;
		animation: overlay-fadeout v-bind('$props.highlightDuration +"ms"')
			ease-in-out;
	}
}
@keyframes overlay-fadeout {
	0% {
		opacity: 0;
	}

	15% {
		opacity: 1;
	}

	100% {
		opacity: 0;
	}
}
</style>
