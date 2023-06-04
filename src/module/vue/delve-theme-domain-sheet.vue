<template>
	<div class="flexcol" :class="$style.sheetStyles">
		<SheetHeaderBasic class="nogrow" :document="data.item" />

		<input
			v-model="data.item.system.summary"
			class="nogrow"
			type="text"
			:placeholder="$t('IRONSWORN.Summary')"
			@blur="save" />
		<MceEditor
			v-model="data.item.system.description"
			style="flex-basis: 8rem" />

		<h3 class="nogrow">{{ $t('IRONSWORN.DELVESITE.Features') }}</h3>
		<table>
			<tbody>
				<tr
					v-for="(feature, i) in data.item.system.features"
					:key="`feature${i}`">
					<td>{{ formattedRange(feature.range) }}</td>
					<td>
						<input v-model="feature.text" type="text" @blur="save" />
					</td>
				</tr>
			</tbody>
		</table>

		<h3 class="nogrow">{{ $t('IRONSWORN.DELVESITE.Dangers') }}</h3>
		<table>
			<tbody>
				<tr v-for="(danger, i) in data.item.system.dangers" :key="`danger${i}`">
					<td>{{ formattedRange(danger.range) }}</td>
					<td>
						<input v-model="danger.text" type="text" @blur="save" />
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
import { inject, provide, computed } from 'vue'
import type { IronswornItem } from '../item/item'
import MceEditor from './components/mce-editor.vue'
import { $ItemKey, ItemKey } from './provisions'
import SheetHeaderBasic from './sheet-header-basic.vue'

const $item = inject<
	IronswornItem<'delve-domain'> | IronswornItem<'delve-theme'>
>($ItemKey)

const props = defineProps<{
	data: { item: ItemSource<'delve-domain'> | ItemSource<'delve-theme'> }
}>()
provide(ItemKey, computed(() => props.data.item) as any)

function formattedRange(range: [number, number]): string {
	if (range[0] === range[1]) return `${range[0]}`
	return `${range[0]}–${range[1]}`
}

function save() {
	const { summary, description, features, dangers } = props.data.item.system
	$item?.update({
		system: { summary, description, features, dangers }
	})
}
</script>

<style lang="scss" module>
.sheetStyles {
	gap: var(--ironsworn-spacer-md);

	h3 {
		margin: var(--ironsworn-spacer-lg) 0 0 0;
	}
}
</style>
