<template>
	<component :is="tag || 'h1'" class="charname">
		<input
			v-model="document.name"
			:placeholder="$t('Name')"
			name="name"
			type="text"
			@blur="save" />
	</component>
</template>

<script setup lang="ts">
import { IronswornItem } from '../../item/item'
import { inject } from 'vue'
import { $ActorKey, $ItemKey } from '../provisions'
const props = defineProps<{
	document: any
	tag?: string
}>()

const $item = inject($ItemKey, undefined)
const $actor = inject($ActorKey, undefined)

function save() {
	const document = $item ?? $actor
	document?.update({ name: props.document.name })
}
</script>
