<template>
	<Collapsible
		v-bind="$props.collapsible"
		ref="$collapsible"
		class="movesheet-row"
		:class="$style.wrapper"
		data-tooltip-direction="LEFT"
		:base-id="`move_row_${item._id}`"
		:content-wrapper-class="$style.contentWrapper"
		:toggle-wrapper-is="`h${headingLevel}`"
		:toggle-section-class="[$style.toggleSection, toggleSectionClass]"
		:icon="null"
		:toggle-button-class="['bordered', $style.toggleBtn, toggleButtonClass]"
		:toggle-tooltip="toggleTooltip"
		:toggle-wrapper-class="$style.toggleWrapper"
		:toggle-label="move?.displayName"
		:data-move-id="item._id"
		:data-move-uuid="$item.uuid"
	>
		<template #after-toggle>
			<section
				:class="$style.controls"
				class="nogrow"
				data-tooltip-direction="UP"
				data-tourid="move-buttons"
			>
				<slot name="controls">
					<slot
						name="btn-roll-move"
						v-bind="{ disabled: !canRoll, move, class: $style.btn }"
					>
						<BtnRollmove
							:disabled="!canRoll"
							:move="move"
							:class="$style.btn"
						/>
					</slot>
					<slot
						name="btn-oracle"
						v-bind="{
							node: data.oracles[0] ?? {},
							disabled: preventOracle,
							class: $style.btn
						}"
					>
						<BtnOracle
							:node="data.oracles[0] ?? {}"
							:disabled="preventOracle"
							:class="$style.btn"
						/>
					</slot>
					<slot name="btn-chat" v-bind="{ move, class: $style.btn }">
						<BtnSendmovetochat :move="move" :class="$style.btn" />
					</slot>
				</slot>
			</section>
		</template>
		<template #default>
			<RulesTextMove
				:data="item"
				:is-progress-move="$item.system.isProgressMove"
				:class="$style.summary"
			>
				<template #after-footer>
					<OracleTreeNode
						v-for="node of data.oracles"
						:key="node.displayName"
						:class="$style.oracle"
						:node="node"
					/>
				</template>
			</RulesTextMove>
		</template>
	</Collapsible>
</template>

<script setup lang="ts">
import { computed, provide, reactive, ref } from 'vue'
import type { Move } from '../../features/custommoves'
import type { IOracleTreeNode } from '../../features/customoracles'
import { walkOracle } from '../../features/customoracles'
import type { IronswornItem } from '../../item/item'
import { moveHasRollableOptions } from '../../rolls/preroll-dialog'
import BtnRollmove from './buttons/btn-rollmove.vue'
import BtnSendmovetochat from './buttons/btn-sendmovetochat.vue'
import OracleTreeNode from './oracle-tree-node.vue'
import RulesTextMove from './rules-text/rules-text-move.vue'
import Collapsible from './collapsible/collapsible.vue'
import BtnOracle from './buttons/btn-oracle.vue'
import { ItemKey, $ItemKey } from '../provisions.js'
import { enrichMarkdown } from '../vue-plugin.js'
import { uniq } from 'lodash-es'
import { OracleTable } from '../../roll-table/oracle-table'

const props = withDefaults(
	defineProps<{
		move: Move
		headingLevel?: number
		toggleSectionClass?: any
		toggleButtonClass?: any
		/**
		 * Props to be passed to the Collapsible component.
		 */
		collapsible?: Omit<
			PropsOf<typeof Collapsible>,
			| 'contentWrapperClass'
			| 'toggleWrapperIs'
			| 'toggleSectionClass'
			| 'noIcon'
			| 'toggleButtonClass'
			| 'toggleTooltip'
			| 'toggleWrapperClass'
			| 'toggleLabel'
		>
	}>(),
	{
		headingLevel: 4,
		toggleSectionClass: '',
		toggleButtonClass: '',
		oracleDisabled: null
	}
)

const $item = computed(() => props.move.moveItem())
const item = computed(
	() => props.move.moveItem().toObject() as ItemSource<'sfmove'>
)

provide(ItemKey, computed(() => $item.value.toObject()) as any)
provide($ItemKey, $item.value as any)

const data = reactive({
	oracles: [] as IOracleTreeNode[]
})

const $collapsible = ref<typeof Collapsible>()

const canRoll = computed(() => {
	return moveHasRollableOptions($item.value)
})
const preventOracle = computed(() => {
	return data.oracles.length !== 1
})

const toggleTooltip = ref($item.value.system.Trigger?.Text)
;(async function () {
	toggleTooltip.value = await enrichMarkdown(toggleTooltip.value)
})()

const moveId = computed(() => props.move.moveItem().id)

const oracleIds = uniq([
	...($item?.value.system.Oracles ?? []),
	...(props.move.dataforgedMove?.Oracles ?? [])
])
Promise.all(oracleIds.map(OracleTable.getDFOracleByDfId)).then(
	async (dfOracles) => {
		const nodes = await Promise.all(dfOracles.map(walkOracle))
		data.oracles.push(...nodes)
	}
)

defineExpose({
	moveId: moveId.value,
	$collapsible
})
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
