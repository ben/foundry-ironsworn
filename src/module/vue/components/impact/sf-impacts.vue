<template>
	<div :class="$style.grid" :aria-label="$t('IRONSWORN.Impacts')">
		<ImpactCategory
			type="impact"
			name="misfortunes"
			class="flexcol"
			:impacts="[
				{ name: 'wounded' },
				{ name: 'shaken' },
				{ name: 'unprepared' }
			]" />

		<ImpactCategory
			type="impact"
			name="lastingEffects"
			class="flexcol"
			:impacts="[{ name: 'permanentlyharmed' }, { name: 'traumatized' }]" />

		<ImpactCategory
			type="impact"
			name="burdens"
			class="flexcol"
			:impacts="[
				{ name: 'doomed' },
				{ name: 'tormented' },
				{ name: 'indebted' }
			]" />

		<ImpactCategory
			type="impact"
			name="vehicle"
			class="flexcol"
			:impacts="[
				{ name: 'battered', globalHint: true },
				{ name: 'cursed', globalHint: true }
			]" />

		<ImpactCheckboxCustom
			type="impact"
			style="grid-column: 1 / 3"
			debilitykey="custom1" />
		<ImpactCheckboxCustom
			type="impact"
			style="grid-column: 3 / 5"
			debilitykey="custom2" />
	</div>
</template>

<script setup lang="ts">
import ImpactCheckboxCustom from './impact-checkbox-custom.vue'
import ImpactCategory from './impact-category.vue'
</script>

<style lang="scss" module>
.grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: var(--ironsworn-spacer-md);
	padding: 0 var(--ironsworn-spacer-md);
}
</style>
