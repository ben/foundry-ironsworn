<template>
	<article class="flexcol" :class="$style.wrapper">
		<nav class="flexrow nogrow" :class="$style.nav">
			<input
				v-model="state.searchQuery"
				type="search"
				:placeholder="
					$t('SIDEBAR.Search', { types: $t('IRONSWORN.ITEMS.TypeMove') })
				"
				@keydown.enter.prevent />
			<IronBtn
				icon="fa:xmark-circle"
				class="nogrow"
				:class="$style.btn"
				style="padding: 6px"
				@click="clearSearch()" />
			<IronBtn
				icon="fa:down-left-and-up-right-to-center"
				class="nogrow"
				:class="$style.btn"
				style="padding: 6px"
				@click="collapseMoveCategories()" />
		</nav>

		<IronList class="scrollable flexcol" :class="$style.list">
			<template v-if="state.searchQuery">
				<!-- Flat search results -->
				<li
					v-for="(move, resultIndex) of searchResults"
					:key="move.moveItem().id ?? `move${resultIndex}`"
					class="nogrow">
					<SfMoverow
						ref="allMoves"
						:move="move"
						:thematic-color="move.color"
						:class="$style.filteredResult" />
				</li>
			</template>
			<template v-else>
				<!-- Categorized moves if not searching -->
				<li
					v-for="(category, catIndex) in state.categories"
					:key="catIndex"
					class="nogrow"
					:class="$style.listItem"
					:style="`--ironsworn-color-thematic: ${category.color};`">
					<SfMoveCategoryRows
						ref="allCategories"
						class="nogrow"
						:thematic-color="(category.color as string)"
						:class="$style.catList"
						:category="category"
						:data-tourid="`move-category-${category.dataforgedCategory?.$id}`" />
				</li>
			</template>
		</IronList>
	</article>
</template>

<script setup lang="ts">
import { computed, nextTick, provide, reactive, ref } from 'vue'
import type {
	MoveCategory
} from '../../features/custommoves';
import {
	createIronswornMoveTree,
	createStarforgedMoveTree
} from '../../features/custommoves'
import SfMoveCategoryRows from './sf-move-category-rows.vue'
import SfMoverow from './sf-moverow.vue'
import IronBtn from './buttons/iron-btn.vue'
import IronList from 'component:list/iron-list.vue'

const props = defineProps<{ toolset: 'ironsworn' | 'starforged' }>()
provide('toolset', props.toolset)

const state = reactive({
	searchQuery: '',
	categories: [] as MoveCategory[]
})

const allCategories = ref<InstanceType<typeof SfMoveCategoryRows>[]>([])
const allMoves = ref<InstanceType<typeof SfMoverow>[]>([])

const tempCategories =
	props.toolset === 'ironsworn'
		? await createIronswornMoveTree()
		: await createStarforgedMoveTree()

state.categories = tempCategories

const checkedSearchQuery = computed(() => {
	try {
		new RegExp(state.searchQuery)
		return state.searchQuery
	} catch (error) {
		return ''
	}
})

const flatMoves = computed(() =>
	state.categories.flatMap((category) =>
		category.moves.map((mv) => ({ ...mv, color: category.color }))
	)
)

const searchResults = computed(() => {
	if (!checkedSearchQuery.value) return null

	const re = new RegExp(checkedSearchQuery.value, 'i')
	return flatMoves.value.filter((x) => re.test(x.displayName))
})

function clearSearch() {
	state.searchQuery = ''
}

function collapseMoves() {
	for (const cat of allCategories.value ?? []) {
		cat.collapseMoves()
	}
}

function collapseMoveCategories() {
	for (const moveCategory of allCategories.value ?? []) {
		moveCategory.$collapsible?.collapse()
	}
}

CONFIG.IRONSWORN.emitter.on('highlightMove', async (targetMoveUuid) => {
	clearSearch()
	await nextTick()
	const { documentId } = _parseUuid(targetMoveUuid)
	const categoryWithMove = allCategories.value.find((moveCategory) =>
		moveCategory.moveItems.has(documentId ?? '')
	)
	if (categoryWithMove) {
		categoryWithMove.expandAndHighlightMove(targetMoveUuid)
	}
})
</script>

<style lang="scss" module>
.nav {
	margin-top: var(--ironsworn-spacer-lg);
}

.btn {
	aspect-ratio: 1;
	flex: 0;

	// padding: 6px;
	&:empty {
		padding: var(--ironsworn-spacer-md);
		width: var(--form-field-height);

		// to override default icon-button styling
		height: var(--form-field-height);
	}
}

.wrapper {
	gap: var(--ironsworn-spacer-lg);
}

.list {
	scroll-behavior: smooth;
	scroll-snap-type: mandatory;
	scroll-snap-align: start;
	gap: var(--ironsworn-spacer-md);
	margin: 0;
}

.listItem {
	border-style: solid;
	border-color: var(--ironsworn-color-thematic);
	border-width: var(--ironsworn-border-width-lg);
	background-color: var(--ironsworn-color-thematic);
	border-radius: var(--ironsworn-border-radius-lg);

	// padding: var(--ironsworn-border-width-lg);
	padding-left: var(--ironsworn-spacer-xl);
}

.catList {
	background-color: var(--ironsworn-color-bg);
	border-top-right-radius: var(--ironsworn-border-radius-md);
	border-bottom-right-radius: var(--ironsworn-border-radius-md);
	border-top-left-radius: var(--ironsworn-border-radius-lg);
	border-bottom-left-radius: var(--ironsworn-border-radius-lg);

	// FIXME: for some reason, no matter where i set overflow, the focus outline on the list items is clipped. ideally, they shouldn't be!
	overflow-x: clip;
	overflow-clip-margin: var(
		--ironsworn-spacer-md
	); // Dec 10, 2022: this would be better as 'padding-box', but major browsers only support length values at the moment.
	// details: https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-clip-margin
}

.filteredResult {
	border-radius: var(--ironsworn-border-radius-lg);
}
</style>
