<template>
	<div :class="$style.wrapper" :aria-labelledby="`title_${baseId}`">
		<h4 :id="`title_${baseId}`" :class="$style.title">
			{{ label }}
		</h4>
		<div :class="impactsClass">
			<ImpactCheckbox
				v-for="impact in impacts"
				:key="impact.name"
				:type="type"
				:name="impact.name"
				:global-hint="impact.globalHint" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import { capitalize } from '../../../helpers/util'
import { ActorKey } from '../../provisions'
import ImpactCheckbox from './impact-checkbox.vue'

type ImpactData = { globalHint?: boolean; name: string }

const props = withDefaults(
	defineProps<{
		name: string
		type: 'debility' | 'impact'
		impacts: ImpactData[]
		impactsClass?: any
	}>(),
	{ impactsClass: {} }
)

const actor = inject(ActorKey) as Ref

const label = computed(() =>
	game.i18n.localize(
		`IRONSWORN.${props.type.toUpperCase()}.CATEGORY.${capitalize(props.name)}`
	)
)

const baseId = computed(() => `impacts_${props.name}_${actor.value._id}`)
</script>

<style lang="scss" module>
.wrapper {
	gap: var(--ironsworn-spacer-sm);
}

.title {
	flex-grow: 0;
	margin: 0;
	text-transform: uppercase;
	font-weight: bold;
}
</style>
