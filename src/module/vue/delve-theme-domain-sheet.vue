<template>
	<div class="flexcol" :class="$style.sheetStyles">
		<SheetHeaderBasic class="nogrow" :document="data.item" />

		<input
			v-model="typedSystem.summary"
			class="nogrow"
			type="text"
			:placeholder="$t('IRONSWORN.Summary')"
			@blur="save" />
		<MceEditor v-model="typedSystem.description" style="flex-basis: 8rem" />

		<h3 class="nogrow">{{ $t('IRONSWORN.DELVESITE.Features') }}</h3>
		<table>
			<tbody>
				<tr v-for="feature in typedSystem.features">
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
				<tr v-for="danger in typedSystem.dangers">
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
import type { DelveThemeDataPropertiesData } from '../item/itemtypes'
import MceEditor from './components/mce-editor.vue'
import { $ItemKey, ItemKey } from './provisions'
import SheetHeaderBasic from './sheet-header-basic.vue'

const $item = inject($ItemKey)

const props = defineProps<{ data: { item: any } }>()
provide(ItemKey, computed(() => props.data.item) as any)

const typedSystem = props.data.item.system as DelveThemeDataPropertiesData

function formattedRange(range: [number, number]): string {
	if (range[0] === range[1]) return `${range[0]}`
	return `${range[0]}–${range[1]}`
}

function save() {
	const { summary, description, features, dangers } = typedSystem
	$item?.update({
		system: { summary, description, features, dangers }
	})
}
</script>

<style lang="less" module>
.sheetStyles {
	gap: var(--ironsworn-spacer-md);

	h3 {
		margin: var(--ironsworn-spacer-lg) 0 0 0;
	}
}
</style>
