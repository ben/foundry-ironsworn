<template>
	<IronList :class="$style.wrapper">
		<CollapseTransition group>
			<template v-for="(item, i) in items">
				<slot
					v-bind="{ item, i, length: items?.length ?? 0, sortFn }"
					name="item">
					<SortableItem
						:key="(item._id as string)"
						:item="item"
						:i="i"
						:length="items?.length ?? 0"
						:sort-fn="sortFn">
						<slot v-bind="{ item }" name="itemContent"></slot>
					</SortableItem>
				</slot>
			</template>
		</CollapseTransition>
	</IronList>
</template>

<script lang="ts" setup>
import IronList from './iron-list.vue'
import { $ActorKey, ActorKey } from '../../provisions'
import { inject, computed } from 'vue'
import SortableItem from './sortable-item.vue'
import CollapseTransition from 'component:transition/collapse-transition.vue'
import type { ItemLike } from './helpers'

const props = withDefaults(
	defineProps<{
		/**
		 * Function to test whether an actor's item should be included in this list
		 */
		filterFn: (item: ItemLike, key?: number | string) => boolean | undefined
	}>(),
	{}
)

const $actor = inject($ActorKey)
const actor = inject(ActorKey)

const items = computed(() =>
	actor?.value.items.filter((item, index) => props.filterFn(item, index))
)
const $items = computed(() =>
	$actor?.items.filter((item, id) => props.filterFn(item, id))
)

async function sortFn(oldIndex: number, newIndex: number, sortBefore: boolean) {
	const foundryItems = $items.value?.sort(
		(a, b) => (a.sort || 0) - (b.sort || 0)
	)
	if (!foundryItems) throw new Error(`Actor's "items" property is undefined`)
	const updates = SortingHelpers.performIntegerSort(foundryItems[oldIndex], {
		target: (foundryItems ?? [])[newIndex],
		siblings: foundryItems,
		sortBefore
	})
	await Promise.all(updates.map(({ target, update }) => target.update(update)))
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>
