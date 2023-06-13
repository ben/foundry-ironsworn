<template>
	<div class="flexcol" :aria-label="$t(labelKey)">
		<div class="flexrow">
			<ImpactCategory
				v-for="category in categories"
				:key="category"
				:category="category"
				class="flexcol"
				:class="$style.conditions"
				:impacts-class="$style.conditionsContents" />
		</div>
		<div class="flexrow">
			<ImpactCheckboxCustom
				v-for="impact in $actor.system.customImpacts"
				:key="(impact.id as string)"
				:placeholder="`${labelKey}.Custom`"
				:status-id="(impact.id as string)"
				:data="(impact.toObject() as StatusEffect)" />
		</div>
	</div>
</template>

<script setup lang="ts">
import ImpactCheckboxCustom from './impact-checkbox-custom.vue'
import ImpactCategory from './impact-category.vue'
import { $ActorKey } from '../../provisions'
import type { IronswornActor } from '../../../actor/actor'
import { inject, computed } from 'vue'
import type { ImpactFlags } from '../../../active-effect/config'

const $actor = inject($ActorKey) as IronswornActor<'character'>

const labelKey =
	$actor.toolset === 'starforged' ? 'IRONSWORN.IMPACT' : 'IRONSWORN.DEBILITY'

const categories = computed(() => {
	const result = new Set<ImpactFlags['category'] & string>()

	for (const fx of CONFIG.statusEffects) {
		if (
			fx.flags?.['foundry-ironsworn']?.type === 'impact' &&
			typeof fx.flags?.['foundry-ironsworn']?.category === 'string'
		)
			result.add(fx.flags?.['foundry-ironsworn']?.category)
	}

	return result
})
</script>

<style lang="scss" module>
.conditionsContents {
}
</style>
