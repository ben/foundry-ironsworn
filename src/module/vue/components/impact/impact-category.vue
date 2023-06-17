<template>
	<div :class="$style.wrapper" :aria-labelledby="`title_${baseId}`">
		<h4 :id="`title_${baseId}`" :class="$style.title">
			{{ label }}
		</h4>
		<div :class="impactsClass">
			<ImpactCheckbox
				v-for="impact in impacts"
				:key="impact.id"
				:data="impact" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import type {
	DebilityCategoryClassic,
	ImpactCategoryStarforged
} from '../../../active-effect/types'
import { $ActorKey, ActorKey } from '../../provisions'
import ImpactCheckbox from './impact-checkbox.vue'

const props = withDefaults(
	defineProps<{
		category: ImpactCategoryStarforged | DebilityCategoryClassic
		impactsClass?: any
	}>(),
	{ impactsClass: {} }
)

const $actor = inject($ActorKey)
const actor = inject(ActorKey)

const impacts = CONFIG.statusEffects.filter(
	(fx) => fx.flags?.['foundry-ironsworn']?.category === props.category
) as StatusEffectV11[]

const label = computed(() =>
	game.i18n.localize(
		`IRONSWORN.${
			$actor?.toolset === 'starforged' ? 'IMPACT' : 'DEBILITY'
		}.CATEGORY.${props.category.capitalize()}`
	)
)

const baseId = computed(() => `impacts_${props.category}_${actor?.value._id}`)
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
