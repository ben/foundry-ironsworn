<template>
	<article :class="$style.wrapper">
		<slot name="header"></slot>
		<template v-if="collapsible">
			<CollapseTransition>
				<slot name="default" v-bind="{ styles: $style }">
					<section :class="$style.body"></section>
				</slot>
			</CollapseTransition>
		</template>
		<template v-else>
			<slot name="default" v-bind="{ styles: $style }">
				<section :class="$style.body"></section>
			</slot>
		</template>
	</article>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { $ActorKey, $ItemKey, ActorKey, ItemKey } from '../../provisions'
import CollapseTransition from '../transition/collapse-transition.vue'

const props = defineProps<{ collapsible?: boolean }>()

const asset = inject(ItemKey)
const $asset = inject($ItemKey)

const actor = inject(ActorKey)
const $actor = inject($ActorKey)
</script>

<style lang="scss" module>
.wrapper {
	--ironsworn-color-thematic: v-bind();
	transition: var(--ironsworn-transition);
	overflow: hidden;
}
.body {
	gap: var(--ironsworn-spacer-lg);
	transition: var(--ironsworn-transition);
	padding: var(--ironsworn-spacer-sm);
	overflow: hidden;
}

.fields {
	display: flex;
	flex-direction: column;
	margin: 0;
}

.abilities {
	gap: var(--ironsworn-spacer-sm);
	margin: 0;
	padding: var(--ironsworn-spacer-sm) 0;
	list-style: none;
	justify-items: stretch;
	> li {
		display: contents;
		> * {
			width: 100%;
		}
	}
}
</style>
