<template>
	<article class="flexcol">
		<ProgressList
			ref="$connectionList"
			:show-completed="'all'"
			:excluded-subtypes="['vow', 'progress']"
			:progress-stars="true" />
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
import { inject } from 'vue'
import { $ActorKey } from '../../provisions'
import IronBtn from '../buttons/iron-btn.vue'
import ProgressList from 'component:progress/progress-list.vue'

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
