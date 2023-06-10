<template>
	<div :class="$style.grid" :aria-label="$t('IRONSWORN.Impacts')">
		<ImpactCategory type="impact" name="misfortunes" class="flexcol" />

		<ImpactCategory type="impact" name="lastingEffects" class="flexcol" />

		<ImpactCategory type="impact" name="burdens" class="flexcol" />

		<ImpactCategory type="impact" name="vehicle" class="flexcol" />

		<ImpactCheckboxCustom
			style="grid-column: 1 / 3"
			status-id="custom1"
			:active-effect="customImpacts[0]" />
		<ImpactCheckboxCustom
			style="grid-column: 3 / 5"
			status-id="custom2"
			:active-effect="customImpacts[1]" />
	</div>
</template>

<script setup lang="ts">
import ImpactCheckboxCustom from './impact-checkbox-custom.vue'
import ImpactCategory from './impact-category.vue'
import { computed, inject } from 'vue'
import { $ActorKey } from '../../provisions'
import type { IronswornActor } from '../../../actor/actor'
const $actor = inject($ActorKey) as IronswornActor<'character'>

const customImpacts = computed(() =>
	$actor.system.customImpacts.map((x) => x.toObject() as any)
)
</script>

<style lang="scss" module>
.grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: var(--ironsworn-spacer-md);
	padding: 0 var(--ironsworn-spacer-md);
}
</style>
