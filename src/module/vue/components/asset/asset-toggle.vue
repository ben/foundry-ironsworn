<template>
	<article
		:class="$style.wrapper"
		class="stack"
		role="radiogroup"
		:aria-label="$t('IRONSWORN.Options')">
		<button
			v-for="(toggleOption, i) in asset.system.exclusiveOptions"
			:key="'option' + i"
			type="button"
			class="clickable block stack-row"
			:class="$style.option"
			:aria-checked="!!toggleOption.selected"
			:aria-readonly="readonly"
			role="radio"
			@click="optionClick(i)">
			{{ toggleOption.name }}
		</button>
	</article>
</template>

<script lang="ts" setup>
// TODO: this shares a lot of functionality with sliders; there should be a base "toggle" component that contains e.g. the keybinding functionality and shared styles. the slider can be derived from that.

import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import { ItemKey, $ItemKey, ActorKey, $ActorKey } from '../../provisions'

const asset = inject(ItemKey) as Ref
const $asset = inject($ItemKey)

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const readonly = computed(() => !actor?.value)

function optionClick(selectedIdx: number) {
	const options = asset.value.system.exclusiveOptions
	for (let i = 0; i < options.length; i++) {
		options[i].selected = i === selectedIdx
	}
	$asset?.update({ system: { exclusiveOptions: options } })
}
</script>

<style lang="scss" module>
.wrapper {
}
.option {
}
</style>
