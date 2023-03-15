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
			:impacts="[{ name: 'maimed' }, { name: 'corrupted' }]" />
		<ImpactCategory
			type="debility"
			name="burdens"
			:impacts="[{ name: 'cursed' }, { name: 'tormented' }]" />

		<ImpactCheckboxCustom
			type="debility"
			style="grid-column: 1 / 3"
			debilitykey="custom1" />
		<ImpactCheckboxCustom
			type="debility"
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
