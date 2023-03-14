<template>
	<article class="flexcol">
		<DropTarget :is="'div'" drop-type="progress">
			<SortableItemList
				:filter-fn="(item: any) => filterFn(item) && item.type === 'progress' && !item.system.completed">
				<template #item="{ item, i, length, sortFn }">
					<ProgressListItem
						:key="(item._id as string)"
						:item="item"
						:i="i"
						:length="length"
						:show-star="progressStars"
						:compact-progress="compactProgress"
						:sort-fn="sortFn" />
				</template>
			</SortableItemList>
		</DropTarget>
		<ProgressControls class="nogrow" :foe-compendium="foeCompendium" />
		<CompletedProgressList
			class="nogrow"
			:collapsible-props="{ toggleWrapperIs: 'h3' }" />
	</article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProgressControls from './progress-controls.vue'
import { IronswornSettings } from '../../../helpers/settings'
import DropTarget from '../../drop-target.vue'
import CompletedProgressList from './completed-progress-list.vue'
import SortableItemList from 'component:list/sortable-item-list.vue'
import ProgressListItem from 'component:progress/progress-list-item.vue'
import type { ItemLike } from 'component:list/helpers'

defineProps<{
	progressStars?: boolean
	/**
	 * When true, renders the progress bars for more compact display.
	 */
	compactProgress?: boolean
	filterFn: (item: ItemLike) => boolean | undefined
}>()

const foeCompendium = computed(() => {
	return IronswornSettings.starforgedToolsEnabled
		? 'starforgedencounters'
		: 'ironswornfoes'
})
</script>
