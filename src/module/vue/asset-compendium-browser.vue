<template>
	<section
		v-for="category in data.categories"
		:key="category.title"
		class="nogrow asset-category"
	>
		<h2 class="flexrow">
			<IronBtn
				:aria-controls="category.title"
				:text="category.title"
				:icon="category.expanded ? 'fa:caret-down' : 'fa:caret-right'"
				@click="category.expanded = !category.expanded"
			/>
		</h2>

		<CollapseTransition>
			<Suspense>
				<div v-if="category.expanded">
					<section
						:id="category.title"
						class="asset-category-contents"
						:aria-expanded="category.expanded"
					>
						<RenderedText
							v-if="category.description"
							element="div"
							class="category-description"
							:content="category.description"
							:markdown="true"
						/>

						<AssetBrowserCard
							v-for="(asset, i) in category.assets"
							:key="asset.foundryItem()?.id ?? i"
							:asset="asset.foundryItem"
							class="nogrow movesheet-row"
						/>
					</section>
				</div>
			</Suspense>
		</CollapseTransition>
	</section>
</template>

<script setup lang="ts">
import { provide, reactive } from 'vue'
import AssetBrowserCard from 'component:asset/asset-browser-card.vue'
import CollapseTransition from 'component:transition/collapse-transition.vue'
import {
	createIronswornAssetTree,
	createStarforgedAssetTree
} from '../features/customassets'
import IronBtn from 'component:buttons/iron-btn.vue'
import RenderedText from 'component:rendered-text.vue'

const props = defineProps<{
	data: { toolset: 'starforged' | 'ironsworn' | 'sunderedisles' }
}>()

provide('toolset', props.data.toolset)

const categories = await (props.data.toolset === 'ironsworn'
	? createIronswornAssetTree()
	: props.data.toolset === 'starforged'
	? createStarforgedAssetTree()
	: []) // TODO: sundered isles

const data = reactive({ categories })
</script>

<style lang="scss" scoped>
h2 {
	margin: 0;
	border: none;
	height: min-content;
	line-height: 1.5;

	button {
		height: min-content;
		text-transform: uppercase;
		line-height: 1.5;
	}
}

.asset-category {
	margin-bottom: 1em;
	border: var(--ironsworn-border-width-md) solid var(--ironsworn-color-border);
	border-radius: var(--ironsworn-border-radius-lg);
	padding: var(--ironsworn-spacer-md);
}

.asset-category-contents {
	margin: var(--ironsworn-spacer-md) var(--ironsworn-spacer-xl);
}

.category-description {
	padding-bottom: var(--ironsworn-spacer-xl);
}
</style>
