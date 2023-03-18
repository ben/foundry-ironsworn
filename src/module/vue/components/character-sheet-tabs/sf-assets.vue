<template>
	<DropTarget
		is="article"
		drop-type="asset"
		class="sf-assets flexcol"
		:class="$style.wrapper">
		<CollapseTransition tag="ul" class="item-list" :class="$style.list" group>
			<li v-for="(asset, i) in assets" :key="asset._id" class="flexrow">
				<order-buttons
					v-if="editMode"
					:i="i"
					:length="assets.length"
					@sortUp="sortUp"
					@sortDown="sortDown" />
				<AssetCompact :class="$style.item" :asset="asset" />
			</li>
		</CollapseTransition>
		<section
			:class="$style.controls"
			class="flexrow nogrow"
			style="text-align: center">
			<IronBtn
				icon="fa:book-atlas"
				block
				:text="$t('IRONSWORN.ITEMS.TypeAsset')"
				@click="assetBrowser" />
		</section>
	</DropTarget>
</template>

<script lang="ts" setup>
import { sortBy } from 'lodash-es'
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import OrderButtons from 'component:order-buttons.vue'
import AssetCompact from 'component:asset/asset-compact.vue'
import IronBtn from 'component:buttons/iron-btn.vue'
import { $ActorKey, ActorKey } from '../../provisions'
import { AssetCompendiumBrowser } from '../../../item/asset-compendium-browser'
import CollapseTransition from 'component:transition/collapse-transition.vue'
import DropTarget from '../../drop-target.vue'

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const editMode = computed(() => {
	return actor.value.flags['foundry-ironsworn']?.['edit-mode']
})
const assets = computed(() => {
	const assets = actor.value.items.filter((x) => x.type === 'asset')
	return sortBy(assets, (x) => x.sort)
})

async function applySort(oldI, newI, sortBefore) {
	const foundryItems = $actor?.items
		.filter((x) => x.type === 'asset')
		.sort((a, b) => (a.data.sort || 0) - (b.data.sort || 0))
	const updates = SortingHelpers.performIntegerSort(foundryItems?.[oldI], {
		target: (foundryItems ?? [])[newI],
		siblings: foundryItems,
		sortBefore
	})
	await Promise.all(updates.map(({ target, update }) => target?.update(update)))
}
function sortUp(i) {
	applySort(i, i - 1, true)
}
function sortDown(i) {
	applySort(i, i + 1, false)
}

let theAssetBrowser: AssetCompendiumBrowser | undefined
function assetBrowser() {
	if (!theAssetBrowser) {
		theAssetBrowser = new AssetCompendiumBrowser(
			$actor?.toolset ?? 'starforged'
		)
	}
	theAssetBrowser.render(true, { focus: true })
}
</script>

<style lang="scss" module>
.controls {
	--ironsworn-line-height: var(--ironsworn-line-height-sm);
}

.wrapper {
	gap: var(--ironsworn-spacer-md);
}

.list {
	gap: var(--ironsworn-spacer-md);
}

.item {
	border-width: var(--ironsworn-border-width-md);
	border-style: solid;
	border-radius: var(--ironsworn-border-radius-sm);
	border-color: var(--ironsworn-color-border);
}
</style>
