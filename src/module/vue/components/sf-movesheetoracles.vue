<template>
	<div class="flexcol" :class="$style.wrapper">
		<div class="flexrow nogrow" :class="$style.nav">
			<input
				v-model="search.q"
				type="text"
				:placeholder="
					$t('SIDEBAR.Search', { types: $t('IRONSWORN.ROLLTABLES.TypeOracle') })
				"
				@keydown.enter.prevent
			/>
			<IronBtn
				icon="fa:xmark-circle"
				class="nogrow"
				:class="$style.btn"
				style="padding: 6px"
				@click="clearSearch"
			/>
			<IronBtn
				icon="fa:down-left-and-up-right-to-center"
				class="nogrow"
				:class="$style.btn"
				style="padding: 6px"
				@click="collapseAll"
			/>
		</div>

		<div class="item-list scrollable flexcol" :class="$style.list">
			<section v-for="section in sections" style="flex: 0">
				<h4 v-if="showHeadings" :class="$style.h4">
					{{ section.displayName }}
				</h4>
				<OracleTreeNode
					v-for="node in section.children"
					:key="node.displayName"
					ref="oracles"
					:node="node"
				/>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue'
import type { IOracleTreeNode } from '../../features/customoracles'
import { getCustomizedOracleTrees } from '../../features/customoracles'
import { OracleTable } from '../../roll-table/oracle-table'
import IronBtn from './buttons/iron-btn.vue'
import OracleTreeNode from './oracle-tree-node.vue'

const trees = await getCustomizedOracleTrees()
const sections = trees.map((t) => reactive<IOracleTreeNode>(t))
const showHeadings = sections.length > 1

type ReactiveNode = (typeof sections)[0]

const search = reactive({ q: '' })
watch(search, ({ q }) => {
	// If it's not a real regex, cancel the search
	let re
	try {
		re = new RegExp(q, 'i')
	} catch {}

	if (q && re) {
		// Walk the tree and test each name.
		// Force expanded on all parent nodes leading to a match
		const searchWalk = (node: ReactiveNode, parentMatch: boolean): boolean => {
			// Match against current name (i18n) but also aliases in Dataforged
			let thisMatch =
				re.test(node.displayName) || re.test(node.dataswornNode?.canonical_name)

			// Check for descendant matches
			let childMatch = false
			for (const child of node.children) {
				childMatch ||= searchWalk(child, thisMatch || parentMatch)
			}

			// Expanded if part of a tree with a match
			node.forceExpanded = parentMatch || thisMatch || childMatch
			// Hidden if not
			node.forceHidden = !node.forceExpanded

			// Pass match up to ancestors
			return thisMatch || childMatch
		}
		for (const section of sections) {
			searchWalk(section, false)
		}
	} else {
		// Walk the tree setting all force flags to false
		function resetflags(node) {
			node.forceExpanded = node.forceHidden = false
			for (const child of node.children) resetflags(child)
		}
		for (const section of sections) {
			resetflags(section)
		}
	}
})
function clearSearch() {
	search.q = ''
}

const oracles = ref<InstanceType<typeof OracleTreeNode>[]>([])

function collapseAll() {
	for (const node of oracles.value) {
		node.collapse()
	}
}

CONFIG.IRONSWORN.emitter.on('highlightOracle', async (dfid) => {
	clearSearch()

	// Find the path in the data tree
	const dfOraclePath = OracleTable.findOracleWithIntermediateNodes(dfid)

	// Wait for children to be present
	while (!oracles.value) {
		await nextTick()
	}

	// Walk the component tree, expanding as we go
	let children = oracles.value
	for (const dataNode of dfOraclePath) {
		const child = children?.find((x: any) => x.dfid() === dataNode.$id)
		if (!child) break
		child.expand()
		await nextTick()
		children = child.$refs.children as any
	}
})
</script>

<style lang="scss" module>
.wrapper {
	gap: var(--ironsworn-spacer-lg);
}

.nav {
	margin-top: var(--ironsworn-spacer-lg);
}

.list {
	padding: 0 var(--ironsworn-spacer-lg);
}

.h4 {
	margin: 0.5rem 0.25rem;
	font-size: 1.1rem;
	text-transform: uppercase;
}
</style>
