<template>
	<div :class="$style.wrapper" class="stack flexrow">
		<div
			v-for="(opt, i) in asset.system.exclusiveOptions"
			:key="'option' + i"
			class="clickable block stack-row"
			:class="{ [$style.option]: true, selected: opt.selected }"
			@click="exclusiveOptionClick(i)">
			{{ opt.name }}
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { ComputedRef } from 'vue'
import { inject } from 'vue'
import { $ItemKey, ItemKey } from '../../../../module/vue/provisions'

const props = withDefaults(
	defineProps<{
		readonly?: boolean
	}>(),
	{}
)

const $asset = inject($ItemKey)
const asset = inject(ItemKey) as ComputedRef

function exclusiveOptionClick(selectedIdx: number) {
	const { exclusiveOptions } = asset.value.system
	for (let i = 0; i < exclusiveOptions.length; i++) {
		exclusiveOptions[i].selected = i === selectedIdx
	}
	$asset?.update({ system: { exclusiveOptions } })
}
</script>

<style lang="scss" module>
.wrapper {
}
.option {
}
</style>
