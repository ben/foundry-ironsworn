<template>
	<Collapsible
		v-bind="$props.collapsibleProps"
		ref="$collapsible"
		:toggle-label="$t('IRONSWORN.Completed')"
		:disabled="!items.length"
		:class="$style.wrapper"
		toggle-button-class="clickable text"
		:base-id="`${actor._id}_progress-completed`">
		<SortableItemList
			ref="$progressList"
			:filter-fn="completedFilterFn"
			:class="$style.list">
			<template #item="{ item, i, length }">
				<ProgressListItem
					:item="item"
					:i="i"
					:length="length"
					:show-star="true" />
			</template>
		</SortableItemList>
	</Collapsible>
</template>

<script lang="ts" setup>
import type { ItemLike } from 'component:list/helpers'
import SortableItemList from 'component:list/sortable-item-list.vue'
import ProgressListItem from 'component:progress/progress-list-item.vue'
import type { ExtractPropTypes, Ref} from 'vue';
import { computed, inject, ref, watch } from 'vue'
import { ActorKey } from '../../provisions'
import Collapsible from '../collapsible/collapsible.vue'

const props = defineProps<{
	collapsibleProps?: Omit<
		ExtractPropTypes<typeof Collapsible>,
		'toggleLabel' | 'baseId'
	>
	collapsibleAttrs?: Record<string, any>
	filterFn?: (
		item: ItemLike & { type: 'progress'; system: { completed: true } }
	) => boolean | undefined
}>()

const actor = inject(ActorKey) as Ref

const completedFilterFn = computed(() => {
	const fn = (item: ItemLike) =>
		item.type === 'progress' && (item as any).system.completed
	if (props.filterFn) return (item) => fn(item) && (props.filterFn as any)(item)
	return fn
})

const $progressList = ref<InstanceType<typeof SortableItemList>>()
const $collapsible = ref<InstanceType<typeof Collapsible>>()

// collapsible inserts/removes components from DOM, so the list's exposed stuff don't always exist.
const items = computed(() => actor.value.items.filter(completedFilterFn.value))

const editMode = computed(
	() => !!(actor.value.flags as any)['foundry-ironsworn']?.['edit-mode']
)

/**
 * If edit mode ends with 0 items, collapse automatically to avoid an open + disabled state.
 */
watch(editMode, () => {
	if (editMode.value === false && items?.value.length === 0) {
		$collapsible.value?.collapse()
	}
})

defineExpose({
	items: items.value,
	$collapsible,
	$progressList
})
</script>

<style lang="scss" module>
.wrapper {
	margin-top: var(--ironsworn-spacer-lg);
	border-width: var(--ironsworn-border-width-md);
	border-style: solid;
	border-radius: var(--ironsworn-border-radius-lg);
	border-color: var(--ironsworn-color-fg-10);
	background-color: var(--ironsworn-color-fg-10);
}

.list {
	margin: 0 var(--ironsworn-spacer-md) var(--ironsworn-spacer-md);
}

.listItem {
	border-color: var(--ironsworn-color-bg-50);
	background-color: var(--ironsworn-color-bg-50);
}
</style>
