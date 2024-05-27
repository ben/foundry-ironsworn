<template>
	<article class="">
		<header class="flexrow">
			<h4 :class="[$style.toggleWrapper, 'toggle-wrapper']">
				<IronBtn
					:class="$style.toggleBtn"
					:tooltip="tooltipText"
					data-tooltip-direction="LEFT"
					:text="move.name"
					@click="expanded = !expanded"
				>
				</IronBtn>
			</h4>
			<section
				:class="$style.controls"
				class="nogrow"
				data-tooltip-direction="UP"
				data-tourid="move-buttons"
			>
				<BtnRollIndexedMove
					:disabled="!move.isRollable"
					:move="move"
					:class="$style.btn"
				/>
				<BtnOracle
					:node="move.defaultOracleNode"
					:disabled="move.defaultOracleNode == null"
					:class="$style.btn"
				/>
				<BtnSendIndexedmoveToChat :move="move" :class="$style.btn" />
			</section>
		</header>
		<CollapseTransition>
			<Suspense v-if="expanded">
				<template #default>
					<SfIndexedMoveContents :move="move" />
				</template>
			</Suspense>
		</CollapseTransition>
	</article>
</template>

<script setup lang="ts">
import { ref, Suspense } from 'vue'
import type { IndexedMove } from '../../features/custommoves'

import Collapsible from './collapsible/collapsible.vue'
import SfIndexedMoveContents from './sf-indexed-move-contents.vue'
import CollapseTransition from './transition/collapse-transition.vue'
import IronBtn from './buttons/iron-btn.vue'
import BtnRollIndexedMove from './buttons/btn-roll-indexedmove.vue'
import BtnOracle from './buttons/btn-oracle.vue'
import BtnSendIndexedmoveToChat from './buttons/btn-send-indexedmove-to-chat.vue'
import { enrichMarkdown } from '../vue-plugin'

const props = withDefaults(
	defineProps<{
		move: IndexedMove
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

const expanded = ref(false)

// Process tooltip async
const tooltipText = ref(props.move.triggerText)
if (props.move.triggerText) {
	;(async () => {
		tooltipText.value = await enrichMarkdown(props.move.triggerText)
	})()
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
	text-transform: uppercase;

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
	margin: 0;
	padding: 0;
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
