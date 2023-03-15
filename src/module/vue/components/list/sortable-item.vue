<template>
	<li :class="$style.wrapper" class="flexrow">
		<div
			v-if="showSortButtons"
			class="flexcol nogrow"
			:class="$style.orderBtns">
			<IronBtn
				icon="fa:caret-up"
				block
				nogrow
				:disabled="!canSortUp"
				:class="{ [$style.orderBtn]: true }"
				@click="sortUp" />
			<IronBtn
				icon="fa:caret-down"
				block
				nogrow
				:disabled="!canSortDown"
				:class="{ [$style.orderBtn]: true }"
				@click="sortDown" />
		</div>
		<div :class="[$style.content, contentWrapperClass ?? '']">
			<slot name="default"></slot>
			<div :class="$style.controls" data-tooltip-direction="UP">
				<slot name="controlsStart"></slot>
				<IronBtn
					v-if="editMode"
					block
					icon="fa:trash"
					:tooltip="
						$t('DOCUMENT.Delete', {
							type: $t('IRONSWORN.ITEM.TypeProgressTrack')
						})
					"
					@click="destroy" />
				<IronBtn
					block
					icon="fa:pen-to-square"
					:tooltip="$t('IRONSWORN.Edit')"
					@click="edit" />

				<slot name="controls"></slot>
			</div>
		</div>
	</li>
</template>

<script lang="ts" setup>
import { computed, inject, provide } from 'vue'
import { $ActorKey, $ItemKey, ActorKey, ItemKey } from '../../provisions'
import IronBtn from '../buttons/iron-btn.vue'

const props = withDefaults(
	defineProps<{
		i: number
		length: number
		item: any
		contentWrapperClass?: string
		/**
		 * Function used adjust sort order. Can be omitted to disable sorting.
		 */
		sortFn?: (
			oldIndex: number,
			newIndex: number,
			sortBefore: boolean
		) => Promise<void>
		deleteButton?: boolean
		editButton?: boolean
	}>(),
	{ deleteButton: true, editButton: true }
)

const $actor = inject($ActorKey)
const actor = inject(ActorKey)

const $item = $actor?.items.get((props.item as any).id ?? props.item._id)

provide(ItemKey, computed(() => $item?.toObject()) as any)
provide($ItemKey, $item)

const editMode = computed(() => {
	return (actor?.value.flags as any)['foundry-ironsworn']?.['edit-mode'] as
		| boolean
		| undefined
})

const showSortButtons = computed(() => props.sortFn && editMode.value)

const canSortUp = computed(() => props.i !== 0)
const canSortDown = computed(() => props.i !== props.length - 1)

function edit() {
	$item?.sheet?.render(true)
}

const typeLabel = computed(() => CONFIG.Item.typeLabels[props.item.type])

function destroy() {
	Dialog.confirm({
		title: game.i18n.format('DOCUMENT.Delete', {
			type: game.i18n.localize(typeLabel.value)
		}),
		content: `<p><strong>${game.i18n.localize(
			'IRONSWORN.ConfirmDelete'
		)}</strong></p>`,
		yes: () => $item?.delete(),
		defaultYes: false
	})
}

function sortUp() {
	if (!props.sortFn)
		throw new Error('sortUp invoked but sortFn was not provided')
	return props.sortFn(props.i, props.i - 1, true)
}
function sortDown() {
	if (!props.sortFn)
		throw new Error('sortDown invoked but sortFn was not provided')
	return props.sortFn(props.i, props.i + 1, false)
}
</script>

<style lang="scss" module>
.wrapper {
}
.content {
	border-width: var(--ironsworn-border-width-md);
	border-style: solid;
	border-radius: var(--ironsworn-border-radius-sm);
	border-color: var(--ironsworn-color-border);
	padding: var(--ironsworn-spacer-sm);
}

.orderBtns {
	padding-right: var(--ironsworn-spacer-sm);
}
.orderBtn {
	padding: var(--ironsworn-spacer-xs);
}
.controls {
	display: grid;
	grid-row: 1 / span 2;
	grid-column: 4;
	grid-auto-flow: column;

	> * {
		aspect-ratio: 1;
		grid-row: 1;
	}
}
.controlBtn {
	flex-grow: 0;
	padding: var(--ironsworn-spacer-md);
}
</style>
