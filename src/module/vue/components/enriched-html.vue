<template>
	<component :is="element" v-html="contents" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { enrichHtml, enrichMarkdown } from '../vue-plugin'
import { IronswornHandlebarsHelpers } from '../../helpers/handlebars.js'

const props = defineProps<{
	source: string
	markdown?: boolean
	stripTables?: boolean
	element: string
}>()
const contents = ref('')

watch(
	() => props.source,
	async (newHtml, oldHtml) => {
		if (oldHtml === newHtml) return

		let value = props.markdown
			? await enrichMarkdown(newHtml)
			: await enrichHtml(newHtml)

		if (props.stripTables) value = IronswornHandlebarsHelpers.stripTables(value)

		contents.value = value
	},
	{ immediate: true }
)
</script>
