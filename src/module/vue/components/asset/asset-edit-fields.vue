<template>
	<div class="flexcol nogrow" style="margin-top: 1em">
		<CollapseTransition group tag="div" class="nogrow">
			<div
				v-for="(field, i) in item.system.fields"
				:key="`field${i}`"
				class="form-group nogrow"
				style="gap: var(--ironsworn-spacer-md)">
				<input
					v-model="field.name"
					type="text"
					:placeholder="$t('Name')"
					@blur="save" />
				<input
					v-model="field.value"
					type="text"
					:placeholder="$t('IRONSWORN.Value')"
					@blur="save" />
				<IronBtn icon="fa:trash" @click="deleteField(i)" />
			</div>
		</CollapseTransition>
		<IronBtn
			icon="fa:plus"
			block
			:text="$t('IRONSWORN.Field')"
			@click="addField" />
	</div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { inject } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'
import IronBtn from '../buttons/iron-btn.vue'
import CollapseTransition from '../transition/collapse-transition.vue'

const item = inject(ItemKey) as Ref
const $item = inject($ItemKey)

function addField() {
	const fields = Object.values(item.value.system.fields) as any[]
	fields.push({ name: '', value: '' })
	$item?.update({ system: { fields } })
}
function deleteField(idx) {
	const fields = Object.values(item.value.system.fields) as any[]
	fields.splice(idx, 1)
	$item?.update({ system: { fields } })
}
function save() {
	const fields = Object.values(item.value.system.fields) as any[]
	$item?.update({ system: { fields } })
}
</script>
