<template>
	<div class="condition-meters flexcol">
		<ConditionMeterSlider
			v-for="resource in resources"
			:key="resource.toLowerCase()"
			slider-style="vertical"
			class="nogrow"
			document-type="Actor"
			:global="resourceIsShared(resource)"
			:attr="resource.toLowerCase()"
			:stat-label="$t(`IRONSWORN.${resource}`)"
			:label-position="props.labelPosition"
		/>
	</div>
</template>

<script lang="ts" setup>
import ConditionMeterSlider from './condition-meter.vue'
import { IronswornSettings } from '../../../helpers/settings.js'

const props = defineProps<{
	labelPosition: 'left' | 'right'
}>()

const resources = ['Health', 'Spirit', 'Supply']
if (IronswornSettings.get('character-hold')) {
	resources.push('Hold')
}

const supplyIsShared = IronswornSettings.get('shared-supply')
function resourceIsShared(rsrc: string): boolean {
	return supplyIsShared && ['Supply', 'Hold'].includes(rsrc)
}
</script>

<style lang="scss">
.condition-meters {
	--ironsworn-meter-spacing: 6px;

	gap: var(--ironsworn-meter-spacing);

	.condition-meter {
		&:not(:first-child) {
			border-top: var(--ironsworn-border-width-md) solid
				var(--ironsworn-color-border);
			padding-top: var(--ironsworn-meter-spacing);
		}
	}

	button {
		height: max-content;
	}
}
</style>
