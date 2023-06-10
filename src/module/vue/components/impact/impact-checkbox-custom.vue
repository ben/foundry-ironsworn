<template>
	<ImpactCheckbox
		:keep-effect="true"
		:effect-data="{ ...activeEffect, id: statusId }"
		:class="$style.wrapper">
		<template #default>
			<input
				v-model="activeEffect.name"
				:class="$style.input"
				type="text"
				@blur="updateName"
				@click.stop />
		</template>
	</ImpactCheckbox>
</template>

<script lang="ts" setup>
import type { ActiveEffectDataProperties } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs'
import type { PropertiesToSource } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { Ref } from 'vue'
import { inject } from 'vue'
import type { IronswornActor } from '../../../actor/actor'
import { $ActorKey, ActorKey } from '../../provisions'
import ImpactCheckbox from './impact-checkbox.vue'

const props = defineProps<{
	activeEffect: PropertiesToSource<ActiveEffectDataProperties> | StatusEffect
	statusId: string
}>()

const actor = inject(ActorKey) as Ref<ActorSource<'character'>>
const $actor = inject($ActorKey) as IronswornActor<'character'>

async function updateName(e) {
	const { _id, name } = props.activeEffect
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
