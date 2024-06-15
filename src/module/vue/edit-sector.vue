<template>
	<div class="flexcol">
		<h4 class="nogrow">
			{{ $t('IRONSWORN.Region') }}
			<i class="fa fa-circle-question" data-tooltip="IRONSWORN.RegionTip"></i>
		</h4>
		<label class="nogrow" v-for="option in options">
			<input v-model="region" type="radio" :value="option.toLowerCase()" />
			{{ $t(`IRONSWORN.REGION.${option}`) }}
		</label>
	</div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { IronswornSettings } from '../helpers/settings'

const props = defineProps<{ data: { sceneId: string } }>()

const defaultToolbox = IronswornSettings.defaultToolbox
const options: string[] =
	defaultToolbox === 'starforged'
		? ['Terminus', 'Outlands', 'Expanse']
		: defaultToolbox === 'sunderedisles'
		? ['Myriads', 'Margins', 'Reaches']
		: []

const scene = game.scenes?.get(props.data.sceneId)
// @ts-expect-error scene.flags isn't in the types
const region = ref<string>(scene?.flags['foundry-ironsworn']?.['region'])

// Send updates to Foundry
watch(region, (newValue) => {
	scene?.setFlag('foundry-ironsworn', 'region', newValue)
})
</script>
