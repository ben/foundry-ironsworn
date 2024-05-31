<template>
	<div class="editor flexcol">
		<with-rolllisteners
			v-if="interceptClicks"
			element="div"
			class="editor-content"
			@moveclick="moveClick"
			@oracleclick="oracleClick"
			v-html="renderedContent"
		/>
		<div v-else class="editor-content" v-html="renderedContent"></div>
		<a class="editor-edit">
			<i class="fas fa-edit" @click="$emit('editclick')"></i>
		</a>
	</div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { IronswornItem } from '../../item/item'
import { enrichHtml } from '../vue-plugin.js'

import WithRolllisteners from './with-rolllisteners.vue'

const props = defineProps<{
	interceptClicks?: boolean
	text: string
}>()
defineEmits(['editclick'])

const renderedContent = ref<string>(props.text)
watch(
	() => props.text,
	async () => {
		renderedContent.value = await enrichHtml(props.text)
	},
	{ immediate: true }
)

// Outbound link clicks: broadcast events
function moveClick(move: IronswornItem) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', move.uuid)
}
function oracleClick(dfid: string) {
	CONFIG.IRONSWORN.emitter.emit('highlightOracle', dfid)
}
</script>
