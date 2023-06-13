<template>
	<ImpactCheckbox :keep-effect="true" :data="data" :class="$style.wrapper">
		<template #default>
			<input
				v-model="data.name"
				:class="$style.input"
				:placeholder="placeholder"
				:aria-label="placeholder"
				type="text"
				@blur="updateName"
				@click.stop />
		</template>
	</ImpactCheckbox>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { inject } from 'vue'
import type { IronswornActor } from '../../../actor/actor'
import { $ActorKey, ActorKey } from '../../provisions'
import ImpactCheckbox from './impact-checkbox.vue'

const props = defineProps<{
	data: StatusEffect
	placeholder: string
}>()

const actor = inject(ActorKey) as Ref<ActorSource<'character'>>
const $actor = inject($ActorKey) as IronswornActor<'character'>

async function updateName(e) {
	const { _id, name } = props.data
	await $actor.updateEmbeddedDocuments('ActiveEffect', [{ _id, name }])
}
</script>

<style lang="scss" module>
.wrapper {
	text-align: start;
}
.input {
	outline: 0;
	border: 0;
	border-bottom: var(--ironsworn-border-width-md) solid;
	text-align: start !important;
	&:hover {
		// hides box shadow to avoid doubling up on the glow FX from the checkbox component
		box-shadow: none !important;
	}
}
</style>
