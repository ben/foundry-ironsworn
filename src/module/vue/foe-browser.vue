<template>
	<section
		v-for="ruleset in rulesets"
		:key="ruleset.displayName"
		class="nogrow asset-ruleset"
	>
		<h1>{{ ruleset.displayName }}</h1>
		<section
			v-for="category in ruleset.categories"
			:key="category.displayName"
			class="nogrow foe-category"
		>
			<h2 class="flexrow">
				<IronBtn
					:aria-controls="category.displayName"
					:text="category.displayName"
					:icon="category.expanded ? 'fa:caret-down' : 'fa:caret-right'"
					@click="category.expanded = !category.expanded"
				/>
			</h2>

			<CollapseTransition>
				<Suspense>
					<div v-if="category.expanded">
						<section
							:id="category.ds?._id ?? category.displayName"
							class="foe-category-contents"
							:aria-expanded="category.expanded"
						>
							<RenderedText
								v-if="category.description"
								element="div"
								class="category-description"
								:content="category.description"
								:markdown="true"
							/>

							<FoeBrowserRow
								v-for="foe in category.foes"
								:key="foe.uuid"
								:foe="foe"
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
import { createFoeTree } from '../features/customfoes'

import CollapseTransition from 'component:transition/collapse-transition.vue'
import IronBtn from 'component:buttons/iron-btn.vue'
import RenderedText from 'component:rendered-text.vue'
import FoeBrowserRow from 'component:foe-browser/foe-browser-row.vue'

// Not used, but this prevents a Vue warning
defineProps<{ data: any }>()

const rawRulesets = await createFoeTree()
const rulesets = ref(rawRulesets.filter((x) => x.categories.length > 0))
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

.foe-category {
	margin-bottom: 1em;
	border: var(--ironsworn-border-width-md) solid var(--ironsworn-color-border);
	border-radius: var(--ironsworn-border-radius-lg);
	padding: var(--ironsworn-spacer-md);
}

.foe-category-contents {
	margin: var(--ironsworn-spacer-md) var(--ironsworn-spacer-xl);
}

.category-description {
	padding-bottom: var(--ironsworn-spacer-xl);
}
</style>
