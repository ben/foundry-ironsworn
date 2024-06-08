<template>
	<div class="editor flexcol">
		<WithRolllisteners
			element="div"
			class="editor-content"
			v-html="renderedContent"
		/>
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
</script>
