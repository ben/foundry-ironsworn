<template>
	<Collapsible
		ref="$collapsible"
		class="list-block"
		:class="$style.wrapper"
		:toggle-button-class="$style.toggleBtn"
		:toggle-tooltip="$enrichMarkdown(folder.description)"
		:toggle-wrapper-is="`h${headingLevel}`"
		:toggle-wrapper-class="$style.toggleWrapper"
		:toggle-section-class="`${$style.toggleSection} list-block-header`"
		:base-id="`move_category_${snakeCase($folder.uuid)}`"
		:toggle-label="folder.name"
		:toggle-text-class="$style.toggleText">
		<template #default>
			<ul class="flexcol" :class="$style.list">
				<li
					v-for="[id, move] of moveItems.entries()"
					:key="id"
					class="list-block-item nogrow"
					:class="$style.listItem">
					<SfMoverow
						ref="$children"
						:get-move="() => move"
						:heading-level="headingLevel + 1"
						:class="$style.moveRow"
						thematic-color="transparent"
						@afterExpand="afterMoveExpand" />
				</li>
			</ul>
		</template>
	</Collapsible>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import SfMoverow from './sf-moverow.vue'
import Collapsible from './collapsible/collapsible.vue'
import { snakeCase } from 'lodash-es'
import type { FolderDataSource } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/folderData'
import type { IronswornItem } from '../../item/item'

const props = withDefaults(
	defineProps<{
		getFolder: () => Folder & { type: 'Item' }
		/**
		 * Duration of the move highlight effect, in milliseconds.
		 * @default 2000
		 */
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

const $children = ref<InstanceType<typeof SfMoverow>[]>([])

const $folder = computed(() => props.getFolder())
const folder = computed(
	() => props.getFolder().toObject() as FolderDataSource & { type: 'Item' }
)

/**
 * Index the moves in this category by their Item's `id`, so their data is exposed even when this component is collapsed.
 */
const moveItems = computed(
	() =>
		new Map(
			$folder.value.contents
				?.filter((item) => (item as IronswornItem).type === 'sfmove')
				.map(
					(item) =>
						[(item as IronswornItem)?.id, item] as [
							string,
							IronswornItem<'sfmove'>
						]
				)
		)
)

const $collapsible = ref<typeof Collapsible>()

function collapseMoves() {
	for (const move of $children.value ?? []) {
		move.$collapsible?.collapse()
	}
}

async function expandAndHighlightMove(targetMoveUuid: string) {
	if ($collapsible.value?.isExpanded === false) {
		$collapsible.value.expand()
		await nextTick()
	}
	const { documentId } = CONFIG.IRONSWORN.parseUuid(targetMoveUuid)
	const move = $children.value.find((child) => child.moveId === documentId)
	highlightMove(move?.$collapsible?.$element as HTMLElement)
	if (move?.$collapsible?.isExpanded === false) {
		await move?.$collapsible?.expand()
		// when the expand animation finishes, afterMoveExpand will focus the element
	} else {
		move?.$collapsible?.$element.focus()
	}
}

function highlightMove(element: HTMLElement) {
	element.dataset.highlighted = 'true'
	setTimeout(() => {
		element.dataset.highlighted = 'false'
	}, props.highlightDuration)
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
	moveItems: moveItems.value,
	$children,
	$collapsible
})
</script>
<style lang="scss" module>
@use 'mixin:fx.scss';
@use 'mixin:clickable.scss';

.wrapper {
	--ironsworn-color-text-stroke: var(--ironsworn-color-dark);
	--ironsworn-color-thematic: v-bind('$folder.color');
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
