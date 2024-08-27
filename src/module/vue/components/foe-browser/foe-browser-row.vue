<template>
	<article class="flexcol">
		<header class="flexrow" :class="$style.header">
			<button
				type="button"
				class="clickable text flexrow"
				@click="expanded = !expanded"
			>
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
				<FoeBrowserContent v-if="expanded" :foe="foe" />
			</Suspense>
		</CollapseTransition>
	</article>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import type { DisplayFoe } from '../../../features/customfoes'

import CollapseTransition from 'component:transition/collapse-transition.vue'
import FoeBrowserContent from 'component:foe-browser/foe-browser-content.vue'

defineProps<{ foe: DisplayFoe }>()

const expanded = ref(false)
</script>

<style lang="scss" module>
.header {
	align-items: center;
	gap: 0.25rem;
	h4 {
		margin: 0;
	}
}
</style>
