<template>
	<tr>
		<td>range</td>
		<td>
			<Suspense>
				<RenderedText element="div" :content="rawText" />
			</Suspense>
		</td>
	</tr>
</template>

<script setup lang="ts">
import RenderedText from 'component:rendered-text.vue'

const rawText = defineModel()
</script>
