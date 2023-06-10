<template>
	<div :class="$style.grid" :aria-label="$t('IRONSWORN.Debilities')">
		<ImpactCategory
			type="debility"
			name="conditions"
			:impacts="[
				{ name: 'wounded' },
				{ name: 'unprepared' },
				{ name: 'shaken' },
				{ name: 'encumbered' }
			]"
			:class="$style.conditions"
			:impacts-class="$style.conditionsContents" />
		<ImpactCategory
			type="debility"
			name="banes"
			class="flexcol"
			:impacts="[{ name: 'maimed' }, { name: 'corrupted' }]" />
		<ImpactCategory
			type="debility"
			name="burdens"
			class="flexcol"
			:impacts="[{ name: 'cursed' }, { name: 'tormented' }]" />

		<ImpactCheckboxCustom
			style="grid-column: 1 / 3"
			status-id="custom1"
			:active-effect="customDebilities[0]" />
		<ImpactCheckboxCustom
			style="grid-column: 3 / 5"
			status-id="custom2"
			:active-effect="customDebilities[1]" />
	</div>
</template>

<script setup lang="ts">
import ImpactCheckboxCustom from './impact-checkbox-custom.vue'
import ImpactCategory from './impact-category.vue'
import { $ActorKey } from '../../provisions'
import type { IronswornActor } from '../../../actor/actor'
import { inject, computed } from 'vue'

const $actor = inject($ActorKey) as IronswornActor<'character'>
const customDebilities = computed(() =>
	$actor.system.customImpacts.map((x) => x.toObject() as any)
)
</script>

<style lang="scss" module>
.grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
}

.conditions {
	grid-column: span 2;
}
.conditionsContents {
	display: grid;
	grid-template-rows: 1fr 1fr;
	grid-template-columns: 1fr 1fr;
}
</style>
