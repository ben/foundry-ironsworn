<template>
	<div :class="$style.wrapper" :aria-labelledby="`title_${baseId}`">
		<h4 :id="`title_${baseId}`" :class="$style.title">
			{{ label }}
		</h4>
		<div :class="impactsClass">
			<ImpactCheckbox
				v-for="impact in impacts"
				:key="impact.id"
				:effect-data="impact"
				:type="type" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import type { ImpactCategory } from '../../../active-effect/active-effect'
import { IronActiveEffect } from '../../../active-effect/active-effect'
import { capitalize } from '../../../helpers/util'
import { ActorKey } from '../../provisions'
import ImpactCheckbox from './impact-checkbox.vue'

const props = withDefaults(
	defineProps<{
		type: 'debility' | 'impact'
		name: ImpactCategory
		impactsClass?: any
	}>(),
	{ impactsClass: {} }
)

const statusEffectKey = props.type === 'impact' ? 'starforged' : 'classic'

const impacts =
	IronActiveEffect.statusEffects[statusEffectKey]?.filter(
		(fx) => fx.flags?.['foundry-ironsworn']?.category === props.name
	) ?? []

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
