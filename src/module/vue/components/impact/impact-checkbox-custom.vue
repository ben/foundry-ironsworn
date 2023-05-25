<template>
	<ImpactCheckbox
		:keep-effect="true"
		:effect-data="{ ...activeEffect, id: statusId }"
		:class="$style.wrapper">
		<template #default>
			<input
				v-model="activeEffect.label"
				:class="$style.input"
				type="text"
				@blur="updateName"
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
import { IronActiveEffect } from '../../../active-effect/active-effect'
import type { IronswornActor } from '../../../actor/actor'
import type { ActorSource } from '../../../fields/utils'
import { $ActorKey, ActorKey } from '../../provisions'
import ImpactCheckbox from './impact-checkbox.vue'

const props = defineProps<{
	activeEffect: ActiveEffectDataSource
	statusId: string
}>()

const actor = inject(ActorKey) as Ref<ActorSource<'character'>>
const $actor = inject($ActorKey) as IronswornActor<'character'>

async function updateName(e) {
	const { _id, label } = props.activeEffect
	await $actor.updateEmbeddedDocuments('ActiveEffect', [{ _id, label }])
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
