<template>
	<SheetHeader class="sf-character-header nogrow">
		<DocumentImg :document="actor" size="75px" />
		<section class="header-pc-vitals flexcol">
			<input
				type="text"
				:placeholder="$t('Name')"
				v-model="actor.name"
				ref="name"
				@keyup="save" />
			<input
				type="text"
				:placeholder="$t('IRONSWORN.Pronouns')"
				:value="actor.system.pronouns"
				ref="pronouns"
				@keyup="save" />
			<input
				type="text"
				:placeholder="$t('IRONSWORN.Callsign')"
				:value="actor.system.callsign"
				ref="callsign"
				@keyup="save" />
		</section>

		<textarea
			:value="actor.system.biography"
			ref="characteristics"
			:placeholder="$t('IRONSWORN.Characteristics')"
			@keyup="save" />
	</SheetHeader>
</template>

<style lang="scss" scoped>
input,
textarea {
	border-radius: var(--ironsworn-border-radius-sm);
	border-color: var(--ironsworn-color-fg-10);
	resize: none;
	font-family: var(--font-primary);
	font-size: inherit;
}

textarea {
	flex-basis: 300px;
	flex-grow: 2;
	margin: 0;
}

.header-pc-vitals {
	flex-basis: 100px;
	flex-grow: 1;
	gap: var(--ironsworn-spacer-md);
	min-width: 20ch;
	max-width: 30ch;
}
</style>

<script lang="ts" setup>
import SheetHeader from '../sheet-header.vue'
import { debounce } from 'lodash-es'
import { inject, ref, Ref } from 'vue'
import { $ActorKey, ActorKey } from '../provisions'
import DocumentImg from './document-img.vue'

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const name = ref<HTMLInputElement | null>(null)
const callsign = ref<HTMLInputElement | null>(null)
const pronouns = ref<HTMLInputElement | null>(null)
const characteristics = ref<HTMLInputElement | null>(null)

const save = debounce(() => {
	$actor?.update({
		name: name.value?.value,
		system: {
			callsign: callsign.value?.value,
			pronouns: pronouns.value?.value,
			biography: characteristics.value?.value
		}
	})
}, 500)
</script>
