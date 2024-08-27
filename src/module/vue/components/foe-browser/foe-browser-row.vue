<template>
	<article
		:class="$style.article"
		draggable="true"
		:data-uuid="foe.uuid"
		@dragstart="dragStart"
		@dragend="dragEnd"
	>
		<header :class="$style.header">
			<button
				type="button"
				class="clickable text flexrow"
				:class="$style.expandToggle"
				@click="expanded = !expanded"
			>
				<FontIcon
					name="grip"
					class="nogrow block draggable item"
					:class="$style.dragHandle"
				/>
				<FontIcon
					v-if="foe.isVariant"
					name="angles-right"
					class="nogrow block"
				/>
				<img
					:src="foe.img"
					width="32"
					height="32"
					:alt="foe.displayName"
					class="nogrow"
				/>
				<h4>{{ foe.displayName }}</h4>
				<span :class="$style.nature">
					{{ foe.nature }}
				</span>
			</button>
		</header>

		<CollapseTransition>
			<Suspense>
				<section :class="$style.content" v-if="expanded">
					<FoeBrowserContent :foe="foe" />
				</section>
			</Suspense>
		</CollapseTransition>
	</article>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import type { DisplayFoe } from '../../../features/customfoes'

import LoadingSpinner from 'component:loading-spinner.vue'
import FontIcon from 'component:icon/font-icon.vue'
import CollapseTransition from 'component:transition/collapse-transition.vue'
import FoeBrowserContent from 'component:foe-browser/foe-browser-content.vue'

const props = defineProps<{ foe: DisplayFoe }>()

const expanded = ref(false)

function dragStart(ev) {
	ev.dataTransfer.setData(
		'text/plain',
		JSON.stringify({
			type: 'FoeBrowserData',
			uuid: props.foe.uuid
		})
	)

	CONFIG.IRONSWORN.emitter.emit('dragStart', 'progress')
}

function dragEnd() {
	CONFIG.IRONSWORN.emitter.emit('dragEnd', 'progress')
}
</script>

<style lang="scss" module>
.article {
	grid-template-columns: 1fr;
	margin: var(--ironsworn-spacer-xl) 0;
	// padding: var(--ironsworn-spacer-md);

	border-width: var(--ironsworn-border-width-md);
	border-style: solid;
	border-radius: var(--ironsworn-border-radius-sm);
	border-color: var(--ironsworn-color-border);

	display: grid;
	grid-template-rows: max-content;
	grid-template-columns: 1fr max-content;
	grid-auto-rows: 1fr;
	transition: var(--ironsworn-transition);
	overflow: hidden;
}

.expandToggle {
	flex-grow: 1;
	gap: var(--ironsworn-spacer-lg);
	transition: var(--ironsworn-transition);
	box-shadow: none !important;
	background: none;
	height: 100%;
	align-items: center;
}

.header {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	grid-row: 1;
	grid-column: 1;
	gap: var(--ironsworn-spacer-lg);
	align-items: center;
	min-height: 28px;

	h4 {
		transition: inherit;
		margin: 0;
		text-transform: uppercase;
		line-height: 1;
		word-spacing: var(--ironsworn-word-spacing-sm);
		letter-spacing: var(--ironsworn-letter-spacing-sm);
		font-size: var(--font-size-14);
		font-weight: bold;
		flex-grow: 1;
		text-align: left;
		white-space: nowrap;
	}
}

.dragHandle {
	margin-left: var(--ironsworn-spacer-sm);
}

.nature {
	flex-grow: 0;
	transition: inherit;
	text-align: left;
	line-height: 1;
	color: var(--ironsworn-color-thematic);
	font-style: italic;
	color: var(--ironsworn-color-fg-muted);
}

.content {
	grid-row: 2;
	grid-column: 1;
	gap: var(--ironsworn-spacer-lg);
	transition: var(--ironsworn-transition);
	overflow: hidden;
}
</style>
