<template>
	<RulesTextMove
		:data="moveItem"
		:is-progress-move="moveItem.system.isProgressMove"
		:class="$style.summary"
		@moveclick="moveClick"
	>
		<template #after-footer>
			<OracleTreeNode
				v-for="node of oracles"
				:key="node.displayName"
				:class="$style.oracle"
				:node="node"
			/>
		</template>
	</RulesTextMove>
</template>

<script setup lang="ts">
import type { IndexedMove } from '../../features/custommoves'
import { IronswornItem } from '../../item/item'
import { flatten, uniq } from 'lodash-es'
import { walkOracle } from '../../features/customoracles'
import { OracleTable } from '../../roll-table/oracle-table'

import RulesTextMove from './rules-text/rules-text-move.vue'
import OracleTreeNode from './oracle-tree-node.vue'

const props = defineProps<{
	move: IndexedMove
}>()

// Load all the async pieces we need
const moveItem = (await fromUuid(props.move.uuid)) as IronswornItem<'sfmove'>
const oracleIds = uniq([
	...(moveItem?.system.Oracles ?? []),
	...(props.move.dataforgedMove?.Oracles ?? [])
])
const dfOracles = await Promise.all(
	oracleIds.map(OracleTable.getDFOracleByDfId)
)
const oracles = await Promise.all(dfOracles.map(walkOracle))

// Outbound link clicks: broadcast events
function moveClick(move: IronswornItem) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', move.uuid)
}
</script>

<style lang="scss" module>
@use 'mixin:clickable.scss';

.wrapper {
	--ironsworn-line-height: (--ironsworn-line-height-md);

	position: relative;
	padding: 0 var(--ironsworn-spacer-md);
	transition: var(--ironsworn-transition);

	&[aria-expanded='true'] {
		padding-top: var(--ironsworn-spacer-md);
		padding-bottom: var(--ironsworn-spacer-md);
	}
}

.summary {
	padding: var(--ironsworn-spacer-lg) var(--ironsworn-spacer-lg)
		var(--ironsworn-spacer-md);
}

.btn {
	--ironsworn-color-clickable-text: var(--ironsworn-color-fg);
	--ironsworn-color-clickable-text-hover: var(--ironsworn-color-fg-warm);
	@include clickable.text;

	align-self: center;
	font-size: var(--font-size-20);
	aspect-ratio: 1 !important;
}

.toggleBtn {
	--ironsworn-color-clickable-text: var(--ironsworn-color-fg);
	--ironsworn-color-clickable-text-hover: var(--ironsworn-color-fg-warm);

	@include clickable.text;

	display: flex;
	flex-direction: row;
	align-items: center;
	background: none;
	padding: 0;
	padding-left: var(--ironsworn-spacer-sm);
	height: 100%;
	text-align: left;
	font-size: var(--font-size-16);

	&:hover {
		box-shadow: none;
	}
}

.contentWrapper {
}

.controls {
	display: flex;
	flex-flow: row;
	background: none;
}

.toggleSection {
	display: flex;
	flex-flow: row nowrap;
	gap: var(--ironsworn-spacer-md);
}

.toggleWrapper {
	transition: var(--ironsworn-transition);
	line-height: 1.5;
}

.oracle {
	border-width: var(--ironsworn-border-width-md);
	border-style: solid;
	border-radius: var(--ironsworn-border-radius-sm);
	border-color: var(--ironsworn-color-border);
	padding: 0;

	h4 {
		font-size: var(--font-size-16);

		button.icon-button {
			height: inherit;
		}
	}
}
</style>
