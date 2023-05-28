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

		<ul
			v-if="state.searchQuery"
			class="item-list scrollable flexcol"
			:class="$style.list">
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
		</ul>

		<ul v-else class="item-list scrollable flexcol" :class="$style.list">
			<!-- Categorized moves if not searching -->
			<li
				v-for="(category, catIndex) in state.categories"
				:key="catIndex"
				class="nogrow">
				<SfMoveCategoryRows
					ref="allCategories"
					class="nogrow"
					:class="$style.catList"
					:category="category"
					:data-tourid="`move-category-${category.dataforgedCategory?.$id}`" />
			</li>
		</ul>
	</article>
</template>

<script setup lang="ts">
import { computed, nextTick, provide, reactive, ref } from 'vue'
import type { MoveCategory } from '../../features/custommoves'
import {
	createIronswornMoveTree,
	createStarforgedMoveTree
} from '../../features/custommoves'
import SfMoveCategoryRows from './sf-move-category-rows.vue'
import SfMoverow from './sf-moverow.vue'
import IronBtn from './buttons/iron-btn.vue'

const props = defineProps<{ toolset: 'ironsworn' | 'starforged' }>()
provide('toolset', props.toolset)

const state = reactive({
	searchQuery: '',
	categories: [] as MoveCategory[]
})

let allCategories = ref<InstanceType<typeof SfMoveCategoryRows>[]>([])
let allMoves = ref<InstanceType<typeof SfMoverow>[]>([])

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
	const { documentId } = CONFIG.IRONSWORN.parseUuid(targetMoveUuid)
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

.catList {
	// details: https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-clip-margin
	--ironsworn-line-height: var(--ironsworn-line-height-md);
	// FIXME: for some reason, no matter where i set overflow, the focus outline on the list items is clipped. ideally, they shouldn't be!
	overflow-x: clip;
	overflow-clip-margin: var(
		--ironsworn-spacer-md
	); // Dec 10, 2022: this would be better as 'padding-box', but major browsers only support length values at the moment.
}

.filteredResult {
	border-radius: var(--ironsworn-border-radius-lg);
}
</style>
