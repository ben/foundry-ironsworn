<template>
	<article class="flexcol">
		<SortableItemList
			ref="$connectionList"
			:filter-fn="
        (item) =>
          item.type === 'progress' &&
          !(item as any).system.completed &&
          (item as any).system.subtype === 'bond'
      ">
			<template #item="{ item, i, length }">
				<ProgressListItem
					:item="item"
					:i="i"
					:length="length"
					:show-star="true" />
			</template>
		</SortableItemList>
		<section :class="$style.controls" class="progress-controls flexrow nogrow">
			<IronBtn
				icon="fa:plus"
				block
				:text="$t('IRONSWORN.ITEM.SubtypeConnection')"
				@click="newConnection" />
		</section>
	</article>
</template>
<script setup lang="ts">
import SortableItemList from 'component:list/sortable-item-list.vue'
import ProgressListItem from 'component:progress/progress-list-item.vue'
import { inject } from 'vue'
import { $ActorKey } from '../../provisions'
import IronBtn from '../buttons/iron-btn.vue'

const $actor = inject($ActorKey)

async function newConnection() {
	const item = await Item.create(
		{
			name: game.i18n.localize('IRONSWORN.ITEM.SubtypeConnection'),
			type: 'progress',
			system: { subtype: 'bond' },
			sort: 9000000
		},
		{ parent: $actor }
	)
	item?.sheet?.render(true)
}
</script>
<style lang="scss" module>
.controls {
	--ironsworn-line-height: var(--ironsworn-line-height-sm);
}
</style>
