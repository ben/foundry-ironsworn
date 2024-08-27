<template>
	<article
		:class="{
			[$style.article]: true,
			[$style.variant]: foe.isVariant
		}"
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
				<img
					:src="foe.img"
					width="32"
					height="32"
					:alt="foe.displayName"
					class="nogrow"
				/>
				<h4>{{ foe.displayName }}</h4>
			</button>
		</header>

		<CollapseTransition>
			<Suspense>
				<section v-if="expanded" :class="$style.content">
					<FoeBrowserContent :foe="foe" />
				</section>
				<template #fallback>
					<div class="flexrow" style="height: 200px">
						<LoadingSpinner />
					</div>
				</template>
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

defineProps<{ foe: DisplayFoe }>()

const expanded = ref(false)
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

.variant {
	margin-left: 1rem;
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
		flex-grow: 0;
		white-space: nowrap;
	}
}

.dragHandle {
	margin-left: var(--ironsworn-spacer-sm);
}

.content {
	grid-row: 2;
	grid-column: 1;
	gap: var(--ironsworn-spacer-lg);
	transition: var(--ironsworn-transition);
	overflow: hidden;
}
</style>
