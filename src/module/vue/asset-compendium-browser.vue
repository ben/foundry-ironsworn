<template>
	<section
		v-for="ruleset in rulesets"
		:key="ruleset.title"
		class="nogrow asset-ruleset"
	>
		<h1>{{ ruleset.title }}</h1>
		<section
			v-for="category in ruleset.categories"
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
								:key="asset.ds?._id ?? i"
								:assetFetcher="asset.assetFetcher"
								class="nogrow movesheet-row"
							/>
						</section>
					</div>
				</Suspense>
			</CollapseTransition>
		</section>
	</section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AssetBrowserCard from 'component:asset/asset-browser-card.vue'
import CollapseTransition from 'component:transition/collapse-transition.vue'
import { createMergedAssetTree } from '../features/customassets'
import IronBtn from 'component:buttons/iron-btn.vue'
import RenderedText from 'component:rendered-text.vue'

// Not used, but this prevents a Vue warning
defineProps<{ data: any }>()

const rulesets = ref(await createMergedAssetTree())
</script>

<style lang="scss" scoped>
h1 {
	margin: 0;
	border: none;
	height: min-content;
	line-height: 1.5;
	text-transform: uppercase;
}

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
