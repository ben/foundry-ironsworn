<template>
	<ImpactCheckbox :name="debilitykey" :type="type">
		<template #default="{ id }">
			<input
				:id="id"
				v-model="actor.system.debility[labelKey]"
				:class="$style.input"
				type="text"
				@input="nameUpdate"
				@click.stop />
		</template>
	</ImpactCheckbox>
</template>

<script lang="ts" setup>
import { throttle } from 'lodash-es'
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import { $ActorKey, ActorKey } from '../../provisions'
import ImpactCheckbox from './impact-checkbox.vue'

const props = defineProps<{
	debilitykey: string
	type: 'debility' | 'impact'
}>()

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const labelKey = computed(() => `${props.debilitykey}name`)

async function immediateNameUpdate(e) {
	const nk = labelKey.value
	await $actor?.update({
		[`system.debility.${nk}`]: actor.value.system.debility[nk]
	})
}
const nameUpdate = throttle(immediateNameUpdate, 1000)
</script>

<style lang="scss" module>
.input {
	outline: 0;
	border: 0;
	border-bottom: var(--ironsworn-border-width-md) solid;
}
</style>
