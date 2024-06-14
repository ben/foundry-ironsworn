<template>
	<div class="flexcol">
		<h4 class="nogrow">
			{{ $t('IRONSWORN.Region') }}
			<i class="fa fa-circle-question" data-tooltip="IRONSWORN.RegionTip"></i>
		</h4>
		<label class="nogrow">
			<input v-model="region" type="radio" value="terminus" />
			{{ $t('IRONSWORN.REGION.Terminus') }}
		</label>
		<label class="nogrow">
			<input v-model="region" type="radio" value="outlands" />
			{{ $t('IRONSWORN.REGION.Outlands') }}
		</label>
		<label class="nogrow">
			<input v-model="region" type="radio" value="expanse" />
			{{ $t('IRONSWORN.REGION.Expanse') }}
		</label>
	</div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'

const props = defineProps<{ data: { sceneId: string } }>()

const scene = game.scenes?.get(props.data.sceneId)
const region = ref<string>(scene?.flags['foundry-ironsworn']?.['region'])

// Send updates to Foundry
watch(region, (newValue) => {
	scene?.setFlag('foundry-ironsworn', 'region', newValue)
})
</script>
