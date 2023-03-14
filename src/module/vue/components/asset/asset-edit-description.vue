<template>
	<div class="form-group nogrow">
		<label>{{ $t('IRONSWORN.Category') }}</label>
		<input type="text" v-model="item.system.category" @blur="setCategory" />
	</div>

	<div class="form-group nogrow">
		<label>{{ $t('IRONSWORN.Color') }}</label>
		<input type="color" v-model="item.system.color" @change="setColor" />
	</div>

	<div class="form-group nogrow">
		<label>{{ $t('IRONSWORN.Requirement') }}</label>
		<input
			type="text"
			v-model="item.system.requirement"
			@blur="setRequirement" />
	</div>

	<hr class="nogrow" />
	<MceEditor
		v-model="item.system.description"
		@save="setDescription"
		:editing="true"
		style="flex: 1; height: 100%" />
</template>

<script lang="ts" setup>
import MceEditor from '../mce-editor.vue'
import DocumentName from '../document-name.vue'

import { computed, ComputedRef, inject } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'
import { AssetDataPropertiesData } from '../../../item/itemtypes'

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
