<template>
	<div class="flexcol nogrow" style="margin-top: 1em">
		<CollapseTransition group tag="div">
			<div
				v-for="(option, i) in item.system.exclusiveOptions"
				:key="`item${i}`"
				class="form-group nogrow"
				style="gap: var(--ironsworn-spacer-md)">
				<input
					v-model="option.name"
					type="text"
					:placeholder="$t('IRONSWORN.Label')"
					@blur="save" />
				<IronBtn icon="fa:trash" @click="deleteOption(i)" />
			</div>
		</CollapseTransition>
		<IronBtn
			icon="fa:plus"
			block
			:text="$t('IRONSWORN.Option')"
			@click="addOption" />
	</div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { inject } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'
import CollapseTransition from 'component:transition/collapse-transition.vue'
import IronBtn from 'component:buttons/iron-btn.vue'

const item = inject(ItemKey) as Ref
const $item = inject($ItemKey)

function save() {
	const { exclusiveOptions } = item.value?.data
	$item?.update({ system: { exclusiveOptions } })
}

function deleteOption(idx) {
	const exclusiveOptions = Object.values(
		item.value?.data.exclusiveOptions
	) as any[]
	const needNewSelection = exclusiveOptions[idx].selected
	exclusiveOptions.splice(idx, 1)
	if (needNewSelection && exclusiveOptions[0]) {
		exclusiveOptions[0].selected = true
	}
	$item?.update({ system: { exclusiveOptions } })
}

async function addOption() {
	const exclusiveOptions = Object.values(
		item.value?.data.exclusiveOptions
	) as any[]
	exclusiveOptions.push({
		name: '',
		selected: exclusiveOptions.every((x) => !x.selected)
	})
	$item?.update({ system: { exclusiveOptions } })
}
</script>
