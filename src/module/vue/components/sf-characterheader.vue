<template>
	<SheetHeader class="sf-character-header nogrow">
		<DocumentImg :document="actor" size="75px" />
		<section class="header-pc-vitals flexcol">
			<input ref="name" v-model="actor.name" type="text" :placeholder="$t('Name')" @change="saveName" />
			<input ref="pronouns" type="text" :placeholder="$t('IRONSWORN.Pronouns')" :value="actor.system.pronouns"
				@change="savePronouns" />
			<input ref="callsign" type="text" :placeholder="$t('IRONSWORN.Callsign')" :value="actor.system.callsign"
				@change="saveCallsign" />
		</section>

		<textarea ref="characteristics" :value="actor.system.biography" :placeholder="$t('IRONSWORN.Characteristics')"
			@change="saveCharacteristics" />
	</SheetHeader>
</template>

<script lang="ts" setup>
import SheetHeader from '../sheet-header.vue'
import type { Ref } from 'vue'
import { inject, ref } from 'vue'
import { $ActorKey, ActorKey } from '../provisions'
import DocumentImg from './document-img.vue'

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const name = ref<HTMLInputElement | null>(null)
const callsign = ref<HTMLInputElement | null>(null)
const pronouns = ref<HTMLInputElement | null>(null)
const characteristics = ref<HTMLInputElement | null>(null)

function saveName() {
	$actor?.update({ name: name.value?.value })
}
function saveCallsign() {
	$actor?.update({ 'system.callsign': callsign.value?.value })
}
function savePronouns() {
	$actor?.update({ 'system.pronouns': pronouns.value?.value })
}
function saveCharacteristics() {
	$actor?.update({
		'system.biography': characteristics.value?.value
	})
}
</script>

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
