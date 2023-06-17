<template>
	<ImpactCheckbox
		:keep-effect="true"
		:data="(data as any)"
		:class="$style.wrapper">
		<template #label>
			<input
				v-model="(data as any).name"
				:class="$style.input"
				:placeholder="placeholder"
				:aria-label="placeholder"
				type="text"
				@blur="
					$actor.updateEmbeddedDocuments('ActiveEffect', [
						{ id: data._id, name: (data as any).name }
					])
				"
				@click.stop />
		</template>
		<template #default>
			<IronBtn
				@click="
					$actor.deleteEmbeddedDocuments('ActiveEffect', [data._id as string])
				" />
		</template>
	</ImpactCheckbox>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { inject } from 'vue'
import type { IronActiveEffect } from '../../../active-effect/active-effect'
import type { IronswornActor } from '../../../actor/actor'
import { $ActorKey, ActorKey } from '../../provisions'
import IronBtn from '../buttons/iron-btn.vue'
import ImpactCheckbox from './impact-checkbox.vue'

defineProps<{
	data: ReturnType<IronActiveEffect['toObject']>
	placeholder: string
}>()

const actor = inject(ActorKey) as Ref<ActorSource<'character'>>
const $actor = inject($ActorKey) as IronswornActor<'character'>
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
