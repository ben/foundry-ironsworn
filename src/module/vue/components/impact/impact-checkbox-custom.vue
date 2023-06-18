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
				@blur="$activeEffect.update({ name: (data as any).name })"
				@click.stop />
		</template>
		<template #default>
			<IronBtn
				icon="fa:trash"
				nogrow
				block
				@click="
					$activeEffect.deleteDialog({
						title: deleteDialogTitle
					})
				" />
		</template>
	</ImpactCheckbox>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import type { IronActiveEffect } from '../../../active-effect/active-effect'
import type { IronswornActor } from '../../../actor/actor'
import { $ActorKey } from '../../provisions'
import IronBtn from '../buttons/iron-btn.vue'
import ImpactCheckbox from './impact-checkbox.vue'

const props = defineProps<{
	data: ReturnType<IronActiveEffect['toObject']>
	placeholder: string
}>()

const $actor = inject($ActorKey) as IronswornActor<'character'>

const $activeEffect = computed(
	() => $actor.effects.get(props.data._id as string) as IronActiveEffect
)

const deleteDialogTitle = computed(() =>
	game.i18n.format('DOCUMENT.Delete', {
		type: game.i18n.localize(`IRONSWORN.${$actor.impactType.capitalize()}`)
	})
)
</script>

<style lang="scss" module>
.wrapper {
	--ironsworn-input-min-width: 20%;
	--ironsworn-input-max-width: 50%;

	min-width: var(--ironsworn-input-min-width);
	max-width: var(--ironsworn-input-max-width);
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
