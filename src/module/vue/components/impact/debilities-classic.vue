<template>
	<div class="grid">
		<h4 style="grid-column: 1 / 3">{{ $t('IRONSWORN.Conditions') }}</h4>
		<h4 style="grid-column: 3">{{ $t('IRONSWORN.Banes') }}</h4>
		<h4 style="grid-column: 4">{{ $t('IRONSWORN.Burdens') }}</h4>

		<ImpactCheckbox name="wounded" />
		<ImpactCheckbox name="shaken" />
		<ImpactCheckbox name="maimed" />
		<ImpactCheckbox name="cursed" :global-hint="true" />

		<ImpactCheckbox name="unprepared" />
		<ImpactCheckbox name="encumbered" />
		<ImpactCheckbox name="corrupted" />
		<ImpactCheckbox name="tormented" />

		<ImpactCheckboxCustom style="grid-column: 1 / 3" debilitykey="custom1" />
		<ImpactCheckboxCustom style="grid-column: 3 / 5" debilitykey="custom2" />
	</div>
</template>

<script setup lang="ts">
import ImpactCheckbox from './impact-checkbox.vue'
import ImpactCheckboxCustom from './impact-checkbox-custom.vue'
</script>

<style lang="scss" scoped>
.grid {
	grid-template-columns: repeat(4, 1fr);
}
</style>
