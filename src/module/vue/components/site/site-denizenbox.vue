<template>
	<DropTarget
		is="div"
		:drop-types="['foe']"
		class="box flexrow ironsworn__denizen__drop"
		:data-idx="idx">
		<label
			class="nogrow"
			style="flex-basis: 4em; line-height: 26px; white-space: nowrap">
			<span v-if="denizen.range[0] === denizen.range[1]">{{
				denizen.range[0]
			}}</span>
			<span v-else>{{ denizen.range[0] }}–{{ denizen.range[1] }}</span>
		</label>

		<input
			v-if="editMode"
			ref="description"
			type="text"
			:class="{ highlight: data.focused }"
			:value="denizen.text"
			:placeholder="frequencyLabel"
			@input="input" />
		<div v-else style="line-height: 26px" v-html="$enrichHtml(denizen.text)" />
	</DropTarget>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { reactive, inject, computed, ref } from 'vue'
import type { IronswornActor } from '../../../actor/actor'
import type { SourceData } from '../../../fields/utils'
import DropTarget from '../../drop-target.vue'
import { $ActorKey, ActorKey } from '../../provisions'

const props = defineProps<{ idx: number }>()
const data = reactive({ focused: false })

const actor = inject(ActorKey) as Ref<SourceData<IronswornActor, 'site'>>
const $actor = inject($ActorKey) as IronswornActor<'site'>

const editMode = computed(() => {
	return actor.value?.flags['foundry-ironsworn']?.['edit-mode']
})

const denizen = computed(() => {
	return actor.value?.system.denizens[props.idx]
})

/**
 * Given a dice range, get a localized string describing a site denizen encounter percentage chance.
 */
function getFrequencyDescriptor(floor: number, ceiling: number) {
	const percentChance = ceiling - floor + 1
	switch (true) {
		case percentChance >= 20:
			return game.i18n.localize('IRONSWORN.DELVESITE.FREQUENCY.VeryCommon')
		case percentChance >= 10:
			return game.i18n.localize('IRONSWORN.DELVESITE.FREQUENCY.Common')
		case percentChance >= 5:
			return game.i18n.localize('IRONSWORN.DELVESITE.FREQUENCY.Uncommon')
		case percentChance >= 2:
			return game.i18n.localize('IRONSWORN.DELVESITE.FREQUENCY.Rare')
		default:
			return game.i18n.localize('IRONSWORN.DELVESITE.FREQUENCY.Unforeseen')
	}
}

const frequencyLabel = computed(() =>
	getFrequencyDescriptor(...denizen.value.range)
)

function input(ev: Event) {
	const target = ev.currentTarget as HTMLInputElement
	const newDenizens = foundry.utils.deepClone(actor.value.system.denizens)
	setProperty(newDenizens, `${props.idx}.text`, target.value ?? '')
	$actor?.update({
		[`system.denizens`]: newDenizens
	})
}

const description = ref<HTMLTextAreaElement>()
function focus() {
	data.focused = true
	description.value?.focus()
	setTimeout(() => (data.focused = false), 5000)
}
defineExpose({ focus })
</script>

<style lang="scss" scoped>
input {
	transition: 0.4s ease-out;
}
</style>
