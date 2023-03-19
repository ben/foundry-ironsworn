<template>
	<div class="form-group nogrow">
		<label>{{ $t('IRONSWORN.Category') }}</label>
		<input v-model="item.system.category" type="text" @blur="setCategory" />
	</div>

	<div class="form-group nogrow">
		<label>{{ $t('IRONSWORN.Color') }}</label>
		<input v-model="item.system.color" type="color" @change="setColor" />
	</div>

	<div class="form-group nogrow">
		<label>{{ $t('IRONSWORN.Requirement') }}</label>
		<input
			v-model="item.system.requirement"
			type="text"
			@blur="setRequirement" />
	</div>

	<hr class="nogrow" />
	<MceEditor
		v-model="item.system.description"
		:editing="true"
		style="flex: 1; height: 100%"
		@save="setDescription" />
</template>

<script lang="ts" setup>
import MceEditor from '../mce-editor.vue'

import type { ComputedRef } from 'vue'
import { inject } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'

const $item = inject($ItemKey)
const item = inject(ItemKey) as ComputedRef<any>

function setDescription() {
	if (!item.value) return
	$item?.update({ system: { description: item.value.system.description } })
}
function setCategory() {
	if (!item.value) return
	$item?.update({ system: { category: item.value.system.category } })
}
function setRequirement() {
	if (!item.value) return
	$item?.update({ system: { requirement: item.value.system.requirement } })
}
function setColor() {
	if (!item.value) return
	$item?.update({ system: { color: item.value.system.color } })
}
</script>
