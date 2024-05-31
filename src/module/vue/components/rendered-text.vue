<template>
	<WithRollListeners :element="element" v-html="renderedContent" />
</template>

<script setup lang="ts">
import { enrichMarkdown, enrichHtml } from '../vue-plugin'

import WithRollListeners from 'component:with-rolllisteners.vue'

const props = defineProps<{
	element: string
	content: string
	markdown?: boolean
}>()

const renderedContent = await (props.markdown
	? enrichMarkdown(props.content)
	: enrichHtml(props.content))
</script>
