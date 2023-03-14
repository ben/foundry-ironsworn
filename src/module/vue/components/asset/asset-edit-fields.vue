<template>
	<div class="flexcol nogrow" style="margin-top: 1em">
		<CollapseTransition group tag="div" class="nogrow">
			<div
				class="form-group nogrow"
				style="gap: var(--ironsworn-spacer-md)"
				v-for="(field, i) in item.system.fields"
				:key="`field${i}`">
				<input
					type="text"
					:placeholder="$t('Name')"
					v-model="field.name"
					@blur="save" />
				<input
					type="text"
					:placeholder="$t('IRONSWORN.Value')"
					v-model="field.value"
					@blur="save" />
				<IronBtn icon="fa:trash" @click="deleteField(i)" />
			</div>
		</CollapseTransition>
		<IronBtn
			icon="fa:plus"
			block
			@click="addField"
			:text="$t('IRONSWORN.Field')" />
	</div>
</template>

<script setup lang="ts">
import { inject, Ref } from 'vue'
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
