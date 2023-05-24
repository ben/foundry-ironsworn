<template>
	<ImpactCheckbox
		:keep-effect="true"
		:effect-data="activeEffect"
		:class="$style.wrapper">
		<template #default="{ id }">
			<input
				:id="id"
				v-model="activeEffect.label"
				:class="$style.input"
				type="text"
				@input="nameUpdate"
				@click.stop />
		</template>
	</ImpactCheckbox>
</template>

<script lang="ts" setup>
import type { StatusEffect } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/documents/token'
import type { ActiveEffectDataSource } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData'
import { throttle } from 'lodash-es'
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import type { IronswornActor } from '../../../actor/actor'
import type { ActorSource } from '../../../fields/utils'
import { $ActorKey, ActorKey } from '../../provisions'
import ImpactCheckbox from './impact-checkbox.vue'

const props = defineProps<{
	statusId: string // e.g. custom1 or custom2
}>()

const actor = inject(ActorKey) as Ref<ActorSource<'character'>>
const $actor = inject($ActorKey) as IronswornActor<'character'>

const activeEffectIndex = computed(() =>
	(actor.value.effects as ActiveEffectDataSource[])?.findIndex(
		(fx) => fx._id === props.statusId
	)
)
const activeEffect = computed(
	() =>
		({
			...actor.value.effects[activeEffectIndex.value],
			id: actor.value.effects[activeEffectIndex.value]._id
		} as StatusEffect)
)

async function immediateNameUpdate(e) {
	await $actor?.update({
		[`effects.${activeEffectIndex.value}.label`]: activeEffect.value.label
	})
}
const nameUpdate = throttle(immediateNameUpdate, 1000)
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
