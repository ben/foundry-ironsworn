<template>
	<div class="grid">
		<h5>{{ $t('IRONSWORN.Misfortunes') }}</h5>
		<h5>{{ $t('IRONSWORN.LastingEffects') }}</h5>
		<h5>{{ $t('IRONSWORN.Burdens') }}</h5>
		<h5>{{ $t('IRONSWORN.Vehicle') }}</h5>

		<ImpactCheckbox class="nogrow" name="wounded" />
		<ImpactCheckbox class="nogrow" name="permanentlyharmed" />
		<ImpactCheckbox class="nogrow" name="doomed" />
		<ImpactCheckbox class="nogrow" name="battered" :global-hint="true" />

		<ImpactCheckbox class="nogrow" name="shaken" />
		<ImpactCheckbox class="nogrow" name="traumatized" />
		<ImpactCheckbox class="nogrow" name="tormented" />
		<ImpactCheckbox class="nogrow" name="cursed" :global-hint="true" />

		<ImpactCheckbox class="nogrow" name="unprepared" />
		<ImpactCheckbox class="nogrow" name="indebted" style="grid-column: 3/4" />

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

h5 {
	flex-grow: 0;
	margin: var(--ironsworn-spacer-sm) 0;
}
</style>
