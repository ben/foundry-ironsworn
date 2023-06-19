<template>
	<div class="flexcol" :aria-label="$t(labelKey)" :class="$style.wrapper">
		<div
			class="flexrow"
			:class="$style.commonImpacts"
			data-tooltip-direction="UP">
			<ImpactCategory
				v-for="category in categories"
				:key="category"
				:category="category"
				class="flexcol"
				:class="$style.impactCategory"
				:impacts-class="$style.conditionsContents" />
		</div>
		<CustomImpactControls
			:class="$style.customImpactControls"
			class="flexcol" />
	</div>
</template>

<script setup lang="ts">
import ImpactCategory from './impact-category.vue'
import { $ActorKey } from '../../provisions'
import type { IronswornActor } from '../../../actor/actor'
import { inject, computed } from 'vue'
import type { ImpactFlags } from '../../../active-effect/config'
import CustomImpactControls from './custom-impact-controls.vue'

const $actor = inject($ActorKey) as IronswornActor<'character'>

const labelKey = computed(
	() => `IRONSWORN.${$actor.impactType === 'impact' ? 'Impacts' : 'Debilities'}`
)

const categories = computed(() => {
	const result = new Set<ImpactFlags['category'] & string>()

	for (const fx of $actor?.validImpacts ?? []) {
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
.wrapper {
	gap: var(--ironsworn-spacer-md);
}
.customImpactControls {
}
.commonImpacts {
	gap: var(--ironsworn-spacer-lg);
	justify-content: space-between;
}

.impactCategory {
	max-width: max-content;
}
</style>
