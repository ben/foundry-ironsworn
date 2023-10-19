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
			<li v-for="move of searchResults" :key="move.uuid" class="nogrow">
				<SfMoverow
					ref="moveRows"
					:getMove="() => move"
					:thematic-color="move.folder?.color"
					:class="$style.filteredResult" />
			</li>
		</ul>

		<ul v-else class="item-list scrollable flexcol" :class="$style.list">
			<!-- Categorized moves if not searching -->
			<li v-for="folder in state.folders" :key="folder.uuid" class="nogrow">
				<SfMoveCategoryRows
					ref="categoryChildren"
					class="nogrow"
					:class="$style.catList"
					:get-folder="() => folder"
					:data-tourid="`move-category-${
						folder.flags?.['foundry-ironsworn']?.dfid ?? folder.uuid
					}`" />
			</li>
		</ul>
	</article>
</template>

<script setup lang="ts">
import { computed, nextTick, provide, reactive, ref } from 'vue'
import SfMoveCategoryRows from './sf-move-category-rows.vue'
import SfMoverow from './sf-moverow.vue'
import IronBtn from './buttons/iron-btn.vue'
import type { IronswornItem } from '../../item/item'
import type { IronFolder } from '../../folder/iron-folder'

const props = defineProps<{ toolset: 'ironsworn' | 'starforged' }>()
provide('toolset', props.toolset)

const state = reactive({
	searchQuery: '',
	moves: new Collection<IronswornItem<'sfmove'>>(),
	folders: [] as IronFolder<IronswornItem>[]
})

const categoryChildren = ref<InstanceType<typeof SfMoveCategoryRows>[]>([])
const moveRows = ref<InstanceType<typeof SfMoverow>[]>([])

const packID =
	props.toolset === 'ironsworn'
		? 'foundry-ironsworn.ironswornmoves'
		: 'foundry-ironsworn.starforgedmoves'

const canonicalPack = game.packs.get(packID)

if (canonicalPack == null)
	throw new Error(`Couldn't find moves pack: ${packID}`)

// TODO: figure out a sensible way to store which moves/categories are open/closed

const customMoveFolderName = game.i18n.localize('IRONSWORN.MOVES.Custom')
const customMoveFolder = game.items?.directory?.folders.find(
	(folder) => folder.name === customMoveFolderName
) as IronFolder<IronswornItem> | undefined
const customMoves = Array.from(
	customMoveFolder?.contents?.filter((item) => item.type === 'sfmove') ?? []
) as IronswornItem<'sfmove'>[]

state.folders = Array.from(
	// @ts-expect-error FIXME outdated typing
	canonicalPack?.folders as Collection<IronFolder<IronswornItem>>
).sort((a, b) => a.sort - b.sort)

if (customMoveFolder != null && customMoves.length > 0) {
	state.folders.push(customMoveFolder)
	for (const move of customMoves) state.moves.set(move.id as string, move)
}

const checkedSearchQuery = computed(() => {
	try {
		new RegExp(state.searchQuery)
		return state.searchQuery
	} catch (error) {
		return ''
	}
})

const fetchedMoves = (await canonicalPack.getDocuments({
	type: 'sfmove'
})) as IronswornItem<'sfmove'>[]

for (const move of fetchedMoves.concat(customMoves))
	state.moves.set(move.id as string, move)

const searchResults = computed(() => {
	if (!checkedSearchQuery.value) return null

	const re = new RegExp(checkedSearchQuery.value, 'i')
	return state.moves.filter((x) => re.test(x.name as string))
})

function clearSearch() {
	state.searchQuery = ''
}

function collapseMoveCategories() {
	for (const moveCategory of categoryChildren.value ?? []) {
		moveCategory.$collapsible?.collapse()
	}
}

CONFIG.IRONSWORN.emitter.on('highlightMove', async (targetMoveUuid) => {
	clearSearch()
	await nextTick()
	const { documentId } = CONFIG.IRONSWORN.parseUuid(targetMoveUuid)
	const categoryWithMove = categoryChildren.value.find((moveCategory) =>
		moveCategory.getMoves().some((move) => move.id === documentId)
	)

	if (categoryWithMove) categoryWithMove.expandAndHighlightMove(targetMoveUuid)
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
