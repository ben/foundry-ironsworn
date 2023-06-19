<template>
	<div class="condition-meters flexcol" :class="$style.wrapper">
		<ConditionMeterSlider
			v-for="resource in ['Health', 'Spirit', 'Supply']"
			:key="resource.toLowerCase()"
			slider-style="vertical"
			class="nogrow"
			:class="$style.meter"
			document-type="Actor"
			:global="resource === 'Supply' && IronswornSettings.get('shared-supply')"
			:attr="resource.toLowerCase()"
			:label-position="props.labelPosition" />
	</div>
</template>

<script lang="ts" setup>
import ConditionMeterSlider from './condition-meter.vue'
import { IronswornSettings } from '../../../helpers/settings.js'

const props = defineProps<{
	labelPosition: 'left' | 'right'
}>()
</script>

<style lang="scss" module>
.wrapper {
	--ironsworn-meter-spacing: 6px;

	gap: var(--ironsworn-meter-spacing);
}
.meter {
	&:not(:first-child) {
		border-top: var(--ironsworn-border-width-md) solid
			var(--ironsworn-color-border);
		padding-top: var(--ironsworn-meter-spacing);
	}

	button {
		height: max-content;
	}
}
</style>
