<template>
	<DropTarget
		is="article"
		drop-type="asset"
		class="flexcol"
		:aria-label="$t('IRONSWORN.ITEMS.TypeAsset')"
		:class="$style.wrapper"
	>
		<slot name="start"></slot>

		<CollapseTransition
			tag="ul"
			class="flexcol item-list"
			group
			:class="$style.list"
		>
			<li v-for="(asset, i) in assets" :key="asset._id" class="flexrow nogrow">
				<slot name="orderButtons">
					<OrderButtons
						v-if="editMode"
						:i="i"
						:length="assets.length"
						@sortUp="assetSortUp"
						@sortDown="assetSortDown"
					/>
				</slot>
				<AssetCompact :asset="asset" :class="$style.asset" />
			</li>
		</CollapseTransition>
		<section class="flexrow nogrow" :class="$style.controls">
			<slot name="controls"></slot>
			<IronBtn
				icon="fa:book-atlas"
				block
				:text="$t('IRONSWORN.ITEMS.TypeAsset')"
				@click="assetBrowser"
			/>
		</section>
		<slot name="end"></slot>
	</DropTarget>
</template>
<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import { $ActorKey, ActorKey } from '../../provisions'
import OrderButtons from 'component:order-buttons.vue'
import AssetCompact from 'component:asset/asset-compact.vue'
import IronBtn from 'component:buttons/iron-btn.vue'
import { AssetCompendiumBrowser } from '../../../item/asset-compendium-browser'
import CollapseTransition from 'component:transition/collapse-transition.vue'
import DropTarget from '../../drop-target.vue'
import { IronswornSettings } from '../../../helpers/settings'

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const assets = computed(() => {
	return actor.value?.items
		.filter((x) => x.type === 'asset')
		.sort((a, b) => (a.sort || 0) - (b.sort || 0))
})
const editMode = computed(() => {
	return actor.value?.flags['foundry-ironsworn']?.['edit-mode']
})

async function applySort(oldI, newI, sortBefore, collection) {
	const sorted = collection.sort(
		(a, b) => (a.system.sort || 0) - (b.system.sort || 0)
	)
	const updates = SortingHelpers.performIntegerSort(sorted[oldI], {
		target: sorted[newI],
		siblings: sorted,
		sortBefore
	})
	await Promise.all(updates.map(({ target, update }) => target.update(update)))
}
function assetSortUp(i) {
	const items = $actor?.items.filter((x) => x.type === 'asset')
	applySort(i, i - 1, true, items)
}
function assetSortDown(i) {
	const items = $actor?.items.filter((x) => x.type === 'asset')
	applySort(i, i + 1, false, items)
}

let theAssetBrowser: AssetCompendiumBrowser | undefined
function assetBrowser() {
	if (!theAssetBrowser) {
		theAssetBrowser = new AssetCompendiumBrowser(
			$actor?.toolset ??
				(IronswornSettings.starforgedToolsEnabled ? 'starforged' : 'ironsworn')
		)
	}
	theAssetBrowser.render(true, { focus: true })
}
</script>
<style lang="scss" module>
.wrapper {
	gap: var(--ironsworn-spacer-md);
}
.list {
	gap: var(--ironsworn-spacer-md);
}

.asset {
	border-width: var(--ironsworn-border-width-md);
	border-style: solid;
	border-radius: var(--ironsworn-border-radius-sm);
	border-color: var(--ironsworn-color-border);
}

.controls {
	--ironsworn-line-height: var(--ironsworn-line-height-sm);

	margin-right: var(--ironsworn-spacer-sm);
	text-align: center;
}
</style>
