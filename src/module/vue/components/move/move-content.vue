<template>
	<RulesTextMove
		:data="moveObj"
		:is-progress-move="foundryMove.system.isProgressMove"
		:class="$style.summary"
	>
		<template #after-footer>
			<OracleTreeNode
				v-for="node of oracleNodes"
				:key="node.displayName"
				:class="$style.oracle"
				:node="node"
			/>
		</template>
	</RulesTextMove>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import { uniq, compact } from 'lodash-es'
import { IronswornItem } from '../../../item/item'
import { OracleTable } from '../../../roll-table/oracle-table'
import { ItemKey, $ItemKey } from '../../provisions.js'
import type { DisplayMove } from '../../../features/custommoves'
import type { IOracleTreeNode } from '../../../features/customoracles'

import RulesTextMove from '../rules-text/rules-text-move.vue'
import OracleTreeNode from '../oracle-tree-node.vue'

const props = defineProps<{
	move: DisplayMove
}>()

const foundryMove = (await fromUuid(props.move.uuid)) as IronswornItem<'sfmove'>
const moveObj = ref(foundryMove.toObject())
provide(ItemKey, moveObj as any)
provide($ItemKey, foundryMove)

const oracleDsIds = uniq([
	...(foundryMove?.system?.dsOracleIds ?? []),
	...Object.values(props.move.ds?.oracles ?? {}).map((x) => x._id)
])
const oracleNodes: IOracleTreeNode[] = await Promise.all(
	oracleDsIds.map(async (oid) => {
		const t = await OracleTable.getByDsId(oid)
		return {
			displayName: t?.name ?? '(missing)',
			tables: compact([t?.uuid]),
			children: []
		}
	})
)
</script>

<style lang="scss" module>
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
