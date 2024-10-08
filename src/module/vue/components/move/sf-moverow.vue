<template>
	<Collapsible
		ref="$collapsible"
		:collapsible="collapsible"
		class="movesheet-row"
		:class="$style.wrapper"
		data-tooltip-direction="LEFT"
		:base-id="`move_row_${move.uuid}`"
		:content-wrapper-class="$style.contentWrapper"
		:toggle-wrapper-is="`h${headingLevel}`"
		:toggle-section-class="[$style.toggleSection, toggleSectionClass]"
		:icon="null"
		:toggle-button-class="['bordered', $style.toggleBtn, toggleButtonClass]"
		:toggle-tooltip="toggleTooltip"
		:toggle-wrapper-class="$style.toggleWrapper"
		:toggle-label="move?.displayName"
		:data-highlighted="dataHighlight"
		:data-move-uuid="move.uuid"
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
						v-bind="{ disabled: !move.isRollable, move, class: $style.btn }"
					>
						<BtnRollmove
							:disabled="!move.isRollable"
							:move="move"
							:class="$style.btn"
						/>
					</slot>
					<slot
						name="btn-oracle"
						v-bind="{
							node: oracleNodes[0] ?? {},
							disabled: preventOracle,
							class: $style.btn
						}"
					>
						<BtnOracle
							:node="oracleNodes[0] ?? {}"
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
			<MoveContent :move="move" />
		</template>
	</Collapsible>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { DisplayMove } from '../../../features/custommoves'
import type { IOracleTreeNode } from '../../../features/customoracles'
import { compact } from 'lodash-es'
import { OracleTable } from '../../../roll-table/oracle-table'

import BtnRollmove from '../buttons/btn-rollmove.vue'
import BtnSendmovetochat from '../buttons/btn-sendmovetochat.vue'
import Collapsible from '../collapsible/collapsible.vue'
import BtnOracle from '../buttons/btn-oracle.vue'
import MoveContent from './move-content.vue'

const props = withDefaults(
	defineProps<{
		move: DisplayMove
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
		highlighted?: boolean
		highlightDuration?: number
	}>(),
	{
		headingLevel: 4,
		toggleSectionClass: '',
		toggleButtonClass: '',
		oracleDisabled: null,
		highlighted: false,
		highlightDuration: 2000
	}
)

const $collapsible = ref<typeof Collapsible>()

const oracleNodes: IOracleTreeNode[] = await Promise.all(
	props.move.oracles.map(async (oid) => {
		const t = await OracleTable.getByDsId(oid)
		return {
			displayName: t?.name ?? '(missing)',
			tables: compact([t?.uuid]),
			children: []
		}
	})
)

const preventOracle = computed(() => {
	return oracleNodes.length !== 1
})

const toggleTooltip = props.move.triggerText

const dataHighlight = ref(false)
async function flashHighlight() {
	// Expand the collapsible if it's not already expanded
	if ($collapsible.value?.isExpanded === false) {
		await $collapsible.value?.expand()
		await new Promise((r) => setTimeout(r, 100))
	}

	// Flash that highlight and bring into focus
	dataHighlight.value = true
	await new Promise((r) => setTimeout(r, 100))
	await $collapsible.value?.$element.focus()

	// Turn off the highlight after a lil while
	await new Promise((r) => setTimeout(r, props.highlightDuration))
	dataHighlight.value = false
}

// Flash the highlight if the prop is set on mount
onMounted(() => {
	if (props.highlighted) flashHighlight()
})
// Flash the highlight if the prop is updated after mount
watch(
	() => props.highlighted,
	(newVal) => {
		if (newVal) flashHighlight()
	}
)

defineExpose({ $collapsible })
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
