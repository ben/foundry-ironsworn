<template>
	<header :class="$style.wrapper">
		<slot name="start"></slot>
		<slot name="title" v-bind="{ name: asset.name, cssClass: $style.title }">
			<IronBtn
				v-if="!!toggleFn"
				:aria-controls="bodyId"
				class="asset-expand-toggle"
				@click="toggleFn">
				<template #text>
					<h4 class="button-text" :class="$style.title">
						{{ asset.name }}
					</h4>
				</template>
			</IronBtn>
			<h4 v-else :class="$style.title">
				{{ asset.name }}
			</h4>
		</slot>
		<slot
			name="type"
			v-bind="{ category: asset?.system.category, cssClass: $style.type }">
			<span :class="$style.type" aria-label="asset type">
				{{ asset?.system.category }}
			</span>
		</slot>
		<slot name="end"></slot>
	</header>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { inject } from 'vue'
import { ItemKey } from '../../provisions'
import IronBtn from '../buttons/iron-btn.vue'

const props = defineProps<{ toggleFn?: () => any }>()

const asset = inject(ItemKey) as Ref
</script>

<style lang="scss" module>
.wrapper {
	gap: var(--ironsworn-spacer-lg);
	align-items: center;
}

.title {
	transition: inherit;
	margin: 0;
	text-transform: uppercase;
	line-height: 1;
	word-spacing: var(--ironsworn-word-spacing-sm);
	letter-spacing: var(--ironsworn-letter-spacing-sm);
	font-size: var(--font-size-14);
	font-weight: bold;
}

.type {
	flex-grow: 0;
	transition: inherit;
	line-height: 1;
	color: var(--ironsworn-color-thematic);
	font-style: italic;
}

.toggle {
	display: flex;
	flex-flow: row wrap;
	gap: var(--ironsworn-spacer-lg);
	transition: var(--ironsworn-transition);
	box-shadow: none !important;
	background: none;
}
</style>
