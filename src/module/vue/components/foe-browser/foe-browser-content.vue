<template>
	<RenderedText
		:class="$style.text"
		element="div"
		:content="obj?.system?.description"
	/>
</template>

<script setup lang="ts">
import type { DisplayFoe } from '../../../features/customfoes'
import type { IronswornItem } from '../../../item/item'

import RenderedText from 'component:rendered-text.vue'

const props = defineProps<{
	foe: DisplayFoe
}>()

const foundryItem = (await fromUuid(
	props.foe.uuid
)) as IronswornItem<'progress'>
const obj = (foundryItem?.toObject() ?? {}) as any
</script>

<style lang="scss" module>
.text {
	margin: var(--ironsworn-spacer-lg);
}
</style>
