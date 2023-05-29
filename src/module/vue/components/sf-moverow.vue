<template>
	<Collapsible
		v-bind="$props.collapsible"
		ref="$collapsible"
		class="movesheet-row"
		:class="$style.wrapper"
		data-tooltip-direction="LEFT"
		:base-id="`move_row_${move.moveItem().id}`"
		:content-wrapper-class="$style.contentWrapper"
		:toggle-wrapper-is="`h${headingLevel}`"
		:toggle-section-class="[$style.toggleSection, toggleSectionClass]"
		:icon="null"
		:toggle-button-class="['bordered', $style.toggleBtn, toggleButtonClass]"
		:toggle-tooltip="toggleTooltip"
		:toggle-wrapper-class="$style.toggleWrapper"
		:toggle-label="move?.displayName"
		:data-move-id="move.moveItem().id"
		:data-move-uuid="move.moveItem().uuid">
		<template #after-toggle>
			<section
				:class="$style.controls"
				class="nogrow"
				data-tooltip-direction="UP"
				data-tourid="move-buttons">
				<BtnRollmove
					:disabled="!canRoll"
					:move="move"
					:class="$style.btn"
					:override-click="onRollClick !== undefined"
					@click="$emit('rollClick')" />
				<BtnOracle
					:node="data.oracles[0] ?? {}"
					:disabled="preventOracle"
					:class="$style.btn"
					:override-click="onOracleClick !== undefined"
					@click="$emit('oracleClick')" />
				<BtnSendmovetochat :move="move" :class="$style.btn" />
			</section>
		</template>
		<template #default>
			<RulesTextMove
				:move="move"
				:class="$style.summary"
				@moveclick="moveClick">
				<template #after-footer>
					<OracleTreeNode
						v-for="node of data.oracles"
						:key="node.displayName"
						:class="$style.oracle"
						:node="node" />
				</template>
			</RulesTextMove>
		</template>
	</Collapsible>
</template>

<script setup lang="ts">
import type { ExtractPropTypes } from 'vue'
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
import type { SFMoveDataPropertiesData } from '../../item/itemtypes'
import { uniq } from 'lodash-es'
import { OracleTable } from '../../roll-table/oracle-table'

const props = withDefaults(
	defineProps<{
		move: Move
		headingLevel?: number
		toggleSectionClass?: any
		toggleButtonClass?: any
		oracleDisabled?: true | false | null

		// Hack: if we declare `click` in the emits, there's no $attrs['onClick']
		// This allows us to check for presence and still use $emit('click')
		// https://github.com/vuejs/core/issues/4736#issuecomment-934156497
		onRollClick?: Function
		onOracleClick?: Function
		/**
		 * Props to be passed to the Collapsible component.
		 */
		collapsible?: Omit<
			ExtractPropTypes<typeof Collapsible>,
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

const $item = computed(() => props.move.moveItem() as IronswornItem)
const $itemSystem = computed(
	() => $item.value?.system as SFMoveDataPropertiesData
)

provide(ItemKey, computed(() => $item.value.toObject()) as any)
provide($ItemKey, $item.value)

const data = reactive({
	oracles: [] as IOracleTreeNode[]
})

const $collapsible = ref<typeof Collapsible>()

type CollapsibleEmits = (typeof Collapsible)['$emit']

interface MoveRowEmits extends CollapsibleEmits {
	rollClick(): void
	oracleClick(): void
}

const $emit = defineEmits<MoveRowEmits>()

const canRoll = computed(() => {
	if (props.onRollClick) return true
	return moveHasRollableOptions($item.value)
})
const preventOracle = computed(() => {
	if (props.oracleDisabled !== null) return props.oracleDisabled
	return data.oracles.length !== 1
})

const toggleTooltip = computed(() =>
	// @ts-expect-error
	enrichMarkdown($item.value.system.Trigger?.Text)
)

const moveId = computed(() => props.move.moveItem().id)

const oracleIds = uniq([
	...($itemSystem.value?.Oracles ?? []),
	...(props.move.dataforgedMove?.Oracles ?? [])
])
Promise.all(oracleIds.map(OracleTable.getDFOracleByDfId)).then(
	async (dfOracles) => {
		const nodes = await Promise.all(dfOracles.map(walkOracle))
		data.oracles.push(...nodes)
	}
)

// Outbound link clicks: broadcast events
function moveClick(move: IronswornItem) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', move.uuid)
}

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
