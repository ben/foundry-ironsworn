<template>
	<Collapsible
		ref="$collapsible"
		class="list-block"
		:expanded="props.expanded"
		:class="$style.wrapper"
		:toggle-button-class="$style.toggleBtn"
		:toggle-tooltip="categoryTooltip"
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
					v-for="dm of category.moves"
					:key="dm.uuid"
					class="list-block-item nogrow"
					:class="$style.listItem"
				>
					<SfMoverow
						ref="$children"
						:move="dm"
						:heading-level="headingLevel + 1"
						:class="$style.moveRow"
						:highlighted="highlightUuid === dm.uuid"
						thematic-color="transparent"
						@afterExpand="afterMoveExpand"
					/>
				</li>
			</ul>
		</template>
	</Collapsible>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DisplayMoveCategory } from '../../features/custommoves.js'
import SfMoverow from './move/sf-moverow.vue'
import Collapsible from './collapsible/collapsible.vue'
import { snakeCase } from 'lodash-es'
import { enrichMarkdown } from '../vue-plugin'

const props = withDefaults(
	defineProps<{
		category: DisplayMoveCategory
		expanded?: boolean
		/**
		 * Duration of the move highlight effect, in milliseconds.
		 * @default 2000
		 */
		headingLevel?: number
		highlightDuration?: number
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

const $children = ref<InstanceType<typeof SfMoverow>[]>([])

const categoryTooltip = ref()
enrichMarkdown(props.category.ds?.description).then(
	(x) => (categoryTooltip.value = x)
)

const moveUuids = computed(() => props.category.moves.map((move) => move.uuid))

const $collapsible = ref<typeof Collapsible>()

function collapseMoves() {
	for (const move of $children.value ?? []) {
		move.$collapsible?.collapse()
	}
}

const highlightUuid = ref<string | undefined>(undefined)
async function expandAndHighlightMove(targetMoveUuid: string) {
	if ($collapsible.value?.isExpanded === false) {
		$collapsible.value.expand()
		await new Promise((r) => setTimeout(r, 100))
	}
	highlightUuid.value = targetMoveUuid
	await new Promise((r) => setTimeout(r, 100))
	highlightUuid.value = undefined
}

function afterMoveExpand(
	expandedElement?: HTMLElement,
	triggerElement?: HTMLElement,
	collapsibleElement?: HTMLElement
) {
	collapsibleElement?.focus()
}

defineExpose({
	expandAndHighlightMove,
	collapseMoves,
	moveUuids,
	$children,
	$collapsible
})
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
