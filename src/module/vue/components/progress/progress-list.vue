<template>
	<CollapseTransition
		group
		tag="ul"
		class="progress-list item-list"
		:class="$style.list">
		<li v-for="(item, i) in items" :key="item._id" class="flexrow nogrow">
			<OrderButtons
				v-if="editMode"
				:i="i"
				:length="items.length"
				@sortUp="sortUp"
				@sortDown="sortDown" />
			<ProgressListItem
				:item="item"
				:show-star="progressStars"
				:compact-progress="compactProgress"
				:class="progressListItemClass"
				@completed="progressCompleted" />
		</li>
	</CollapseTransition>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject, reactive } from 'vue'
import { $ActorKey, ActorKey } from '../../provisions'
import OrderButtons from 'component:order-buttons.vue'
import ProgressListItem from 'component:progress/progress-list-item.vue'
import type { ProgressDataPropertiesData } from '../../../item/itemtypes'
import CollapseTransition from 'component:transition/collapse-transition.vue'
import { getProgressItems, isValidProgressItem } from './progress-common'

const props = defineProps<{
	excludedSubtypes?: ProgressDataPropertiesData['subtype'][]
	showCompleted: 'completed-only' | 'no-completed' | 'all'
	progressStars?: boolean
	/**
	 * When true, renders the progress bars for more compact display.
	 */
	compactProgress?: boolean
	progressListItemClass?: string
}>()

const data = reactive({
	expandCompleted: false,
	highlightCompleted: false
})

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const items = computed(() =>
	getProgressItems(actor.value, props.showCompleted, props.excludedSubtypes)
)

const editMode = computed(() => {
	return actor.value.flags['foundry-ironsworn']?.['edit-mode']
})

let highlightCompletedTimer: NodeJS.Timer | undefined

function progressCompleted() {
	data.highlightCompleted = true
	clearTimeout(highlightCompletedTimer)
	highlightCompletedTimer = setTimeout(() => {
		data.highlightCompleted = false
	}, 2000)
}

async function applySort(oldI, newI, sortBefore, filterFn) {
	const foundryItems = ($actor?.items ?? [])
		// @ts-expect-error
		.filter(filterFn)
		.sort((a, b) => (a.sort || 0) - (b.sort || 0))
	const updates = SortingHelpers.performIntegerSort(foundryItems[oldI], {
		target: (foundryItems ?? [])[newI],
		siblings: foundryItems,
		sortBefore
	})
	await Promise.all(updates.map(({ target, update }) => target.update(update)))
}
function sortUp(i) {
	applySort(i, i - 1, true, (item) =>
		isValidProgressItem(item, props.showCompleted, props.excludedSubtypes)
	)
}
function sortDown(i) {
	applySort(i, i + 1, false, (item) =>
		isValidProgressItem(item, props.showCompleted, props.excludedSubtypes)
	)
}

defineExpose({
	applySort,
	sortUp,
	sortDown,
	items
})
</script>

<style lang="scss" module>
.list {
	gap: var(--ironsworn-spacer-md);
}
</style>
