<template>
	<article class="ironsworn-sheet flexcol">
		<slot name="before-header"></slot>
		<slot name="header">
			<SheetHeaderBasic class="nogrow" :document="props.document" />
		</slot>
		<section class="ironsworn-sheet-body" :class="bodyClass">
			<slot name="default"></slot>
		</section>
	</article>
</template>

<script setup lang="ts">
import SheetHeaderBasic from './sheet-header-basic.vue'
const props = withDefaults(
	defineProps<{
		document: any
		bodyClass?: any
	}>(),
	{ bodyClass: { flexcol: true } }
)
</script>

<style lang="scss" scoped>
.ironsworn-sheet {
	gap: var(--ironsworn-spacer-xl);
}
</style>
