<template>
	<div class="condition-meters flexcol">
		<ConditionMeterSlider
			v-for="resource in ['Health', 'Spirit', 'Supply']"
			:key="resource"
			slider-style="vertical"
			class="nogrow"
			document-type="Actor"
			:global="resource === 'Supply' && IronswornSettings.get('shared-supply')"
			:attr="resource.toLowerCase()"
			:current-value="actorSys[resource.toLowerCase()]"
			:max="5"
			:min="0"
			:stat-label="$t(`IRONSWORN.${resource}`)"
			:label-position="props.labelPosition" />
	</div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { ActorKey } from '../../provisions.js'
import ConditionMeterSlider from './condition-meter.vue'
import { IronswornSettings } from '../../../helpers/settings.js'
import type { CharacterData } from '../../../actor/config'

const props = defineProps<{
	labelPosition: 'left' | 'right'
}>()

const actor = inject(ActorKey)
const actorSys = computed(() => (actor?.value as any)?.system as CharacterData)
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
