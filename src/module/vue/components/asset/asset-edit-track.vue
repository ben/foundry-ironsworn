<template>
	<div class="flexcol nogrow" style="margin-top: 1em">
		<div class="form-group">
			<label class="flexrow" style="align-items: center">
				<input
					type="checkbox"
					class="nogrow"
					:checked="item.system.track.enabled"
					@change="enableClick" />
				<span>{{ $t('IRONSWORN.Enabled') }}</span>
			</label>
		</div>

		<div class="form-group">
			<label>{{ $t('Name') }}</label>
			<input v-model="item.system.track.name" type="text" @blur="updateName" />
		</div>

		<div class="form-group">
			<label>{{ $t('Maximum') }}</label>
			<input
				v-model.number="item.system.track.max"
				type="number"
				@blur="updateMax" />
		</div>

		<AttrSlider
			style="margin-top: var(--ironsworn-spacer-md)"
			attr="track.current"
			document-type="Item"
			:max="item.system.track.max"
			:current-value="item.system.track.current"
			slider-style="horizontal" />

		<hr />

		<h4>{{ $t('IRONSWORN.Conditions') }}</h4>
		<CollapseTransition group tag="div" class="nogrow">
			<div
				v-for="(condition, i) in item.system.conditions"
				:key="`condition${i}`"
				class="form-group nogrow">
				<label>{{ $t('Name') }}</label>
				<input v-model="condition.name" type="text" @blur="saveConditions" />
				<IronBtn icon="fa:trash" @click="deleteCondition(i)" />
			</div>
		</CollapseTransition>
		<IronBtn
			icon="fa:plus"
			block
			:text="$t('IRONSWORN.Condition')"
			@click="addCondition" />
	</div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'
import CollapseTransition from 'component:transition/collapse-transition.vue'
import AttrSlider from 'component:resource-meter/attr-slider.vue'
import IronBtn from 'component:buttons/iron-btn.vue'

const item = inject(ItemKey) as Ref
const $item = inject($ItemKey)

const editMode = computed(() => {
	return item.value.flags['foundry-ironsworn']?.['edit-mode']
})

function enableClick(ev) {
	$item?.update({ 'system.track.enabled': ev.target.checked })
}

function updateName() {
	$item?.update({ 'system.track.name': item.value.system.track.name })
}

function updateMax() {
	$item?.update({ 'system.track.max': item.value.system.track.max })
}

function saveConditions() {
	$item?.update({ 'system.conditions': item.value.system.conditions })
}

function deleteCondition(idx: number) {
	const { conditions } = item.value.system
	conditions.splice(idx, 1)
	$item?.update({ system: { conditions } })
}

function addCondition() {
	const { conditions } = item.value.system
	conditions.push({ name: '', ticked: false })
	$item?.update({ system: { conditions } })
}
</script>
