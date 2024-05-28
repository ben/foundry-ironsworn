<template>
	<div
		ref="$el"
		class="flexcol nogrow movesheet-row"
		:class="{ hidden: node?.forceHidden, highlighted: state.highlighted }"
		data-tooltip-direction="LEFT"
		:data-tourid="`oracle-${node.dataforgedNode?.$id}`"
	>
		<!-- TODO: split this into two components, yo -->
		<!-- Leaf node -->
		<div v-if="isLeaf">
			<h4 class="flexrow">
				<BtnOracle :node="node" :text="node?.displayName">
					<template #icon>
						<IronIcon name="oracle" :size="spacerSize" />
					</template>
				</BtnOracle>
				<IronBtn
					nogrow
					class="show-oracle-info"
					icon="fa:eye"
					@click="toggleDescription()"
				/>
			</h4>
			<CollapseTransition>
				<Suspense v-if="state.descriptionExpanded">
					<OracleExpandedDescription :node="node" />
				</Suspense>
			</CollapseTransition>
		</div>

		<!-- Branch node -->
		<div v-else>
			<h4 class="flexrow">
				<IronBtn :text="node?.displayName" @click="toggleManually()">
					<template #icon>
						<FontIcon
							nogrow
							:class="$style.fontIcon"
							name="caret-right"
							:rotate="
								state.manuallyExpanded ? FontAwesome.Rotate['90deg'] : undefined
							"
						/>
					</template>
				</IronBtn>
			</h4>

			<CollapseTransition>
				<div
					v-show="state.manuallyExpanded"
					class="flexcol"
					:class="$style.indent"
				>
					<oracle-tree-node
						v-for="child in node?.children"
						:key="child.displayName"
						ref="children"
						:node="child"
						@oracleclick="oracleclick"
					/>
				</div>
			</CollapseTransition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import type { IOracleTreeNode } from '../../features/customoracles'
import type { IronswornItem } from '../../item/item'
import type { OracleTable } from '../../roll-table/oracle-table'
import type { LegacyTableRow } from '../../roll-table/roll-table-types'
import { enrichHtml } from '../vue-plugin'

import { FontAwesome } from './icon/icon-common'
import BtnOracle from './buttons/btn-oracle.vue'
import CollapseTransition from './transition/collapse-transition.vue'
import IronBtn from './buttons/iron-btn.vue'
import FontIcon from './icon/font-icon.vue'
import IronIcon from './icon/iron-icon.vue'
import OracleExpandedDescription from './oracle-expanded-description.vue'

const props = defineProps<{ node: IOracleTreeNode }>()

const state = reactive({
	manuallyExpanded: props.node.forceExpanded ?? false,
	descriptionExpanded: false,
	singleDescription: undefined as string | undefined,
	tables: [] as Array<{
		id: string
		title: string
		rows: Array<LegacyTableRow>
		description: string
	}>,
	highlighted: false
})

const spacerSize = '18px'

const isLeaf = computed(() => {
	return props.node.tables.length > 0
})

async function toggleDescription() {
	if (state.tables.length === 0) {
		state.tables = await Promise.all(
			props.node.tables.map(async (tableUuid) => {
				const tableData = (await fromUuid(tableUuid)) as OracleTable
				return {
					id: tableUuid,
					title: tableData.name ?? '',
					rows: tableData.results.map((row: any) => ({
						low: row.range[0],
						high: row.range[1],
						text: row.text,
						selected: false
					})),
					description: tableData.description
				}
			})
		)

		// If all descriptions match, collapse them into one
		if (
			state.tables.every((t) => t.description === state.tables[0].description)
		) {
			state.singleDescription = enrichHtml(state.tables[0].description)
			for (const t of state.tables) {
				t.description = ''
			}
		}

		await nextTick()
	}
	state.descriptionExpanded = !state.descriptionExpanded
}
function toggleManually() {
	state.manuallyExpanded = !state.manuallyExpanded
}

const children = ref([] as any[])

function collapse() {
	state.manuallyExpanded = false
	state.descriptionExpanded = false
	for (const child of children.value ?? []) {
		child.collapse()
	}
}
function expand() {
	state.manuallyExpanded = true
}

const $el = ref<HTMLElement>()
CONFIG.IRONSWORN.emitter.on('highlightOracle', (dfid) => {
	if (props.node.dataforgedNode?.$id === dfid) {
		state.highlighted = true
		$el.value?.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		})
		setTimeout(() => {
			state.highlighted = false
		}, 2000)
	}
})

defineExpose({
	dfid: () => props.node.dataforgedNode?.$id,
	expand,
	collapse
})
</script>

<style lang="scss" module>
.content {
	margin: var(--ironsworn-spacer-sm);
}

.indent {
	margin-left: v-bind(spacerSize);
}

.fontIcon {
	font-size: v-bind(spacerSize);
	height: v-bind(spacerSize);
	width: v-bind(spacerSize);
}
</style>

<style lang="scss" scoped>
.show-oracle-info {
	// padding: 4px;
}

.movesheet-row {
	transition: all 0.4s ease;
}

h4 {
	margin: 0;
	height: min-content;
	line-height: 1;

	button {
		height: min-content;
		text-transform: uppercase;
		line-height: 1;
	}
}

.hidden {
	display: none;
}
</style>
