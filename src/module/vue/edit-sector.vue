<template>
	<div class="flexcol">
		<h4 class="nogrow">
			{{ $t('IRONSWORN.Region') }}
			<i class="fa fa-circle-question" data-tooltip="IRONSWORN.RegionTip"></i>
		</h4>

		<div v-if="starforged" class="nogrow" :class="$style.grid">
			<label class="nogrow" v-for="option in starforgedOptions">
				<input v-model="region" type="radio" :value="option.toLowerCase()" />
				{{ $t(`IRONSWORN.REGION.${option}`) }}
			</label>
		</div>

		<div v-if="sunderedIsles" class="nogrow" :class="$style.grid">
			<label class="nogrow" v-for="option in sunderedIslesOptions">
				<input v-model="region" type="radio" :value="option.toLowerCase()" />
				{{ $t(`IRONSWORN.REGION.${option}`) }}
			</label>
		</div>
	</div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { IronswornSettings } from '../helpers/settings'

const props = defineProps<{ data: { sceneId: string } }>()

const starforged = IronswornSettings.enabledRulesets.includes('starforged')
const starforgedOptions = ['Terminus', 'Outlands', 'Expanse']

const sunderedIsles =
	IronswornSettings.enabledRulesets.includes('sundered_isles')
const sunderedIslesOptions = ['Myriads', 'Margins', 'Reaches']

const scene = game.scenes?.get(props.data.sceneId)
// @ts-expect-error scene.flags isn't in the types
const region = ref<string>(scene?.flags['foundry-ironsworn']?.['region'])

// Send updates to Foundry
watch(region, (newValue) => {
	scene?.setFlag('foundry-ironsworn', 'region', newValue)
})
</script>

<style lang="scss" module>
.grid {
	margin: 0.25rem 1rem;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
}
</style>
