<template>
	<AssetCard
		:class="$style.wrapper"
		:expanded="state.expanded"
		class="item-row document"
		draggable="true"
		:data-pack="foundryItem().pack"
		:data-id="foundryItem().id"
		:data-document-id="foundryItem().id"
		@dragstart="dragStart"
		@dragend="dragEnd"
		@toggle-expand="state.expanded = !state.expanded">
		<template #headerStart>
			<FontIcon name="grip" class="nogrow block draggable item" />
		</template>
	</AssetCard>
</template>

<script setup lang="ts">
import type { IAsset } from 'dataforged'
import { computed, provide, reactive } from 'vue'
import type { IronswornItem } from '../../../item/item'
import { $ItemKey, ItemKey } from '../../provisions.js'
import FontIcon from 'component:icon/font-icon.vue'
import AssetCard from 'component:asset/asset-card.vue'

const props = defineProps<{
	df?: IAsset
	foundryItem: () => IronswornItem
}>()

provide($ItemKey, props.foundryItem())
provide(
	ItemKey,
	computed(() => props.foundryItem().toObject() as any)
)

const state = reactive({
	expanded: false
})

function dragStart(ev) {
	ev.dataTransfer.setData(
		'text/plain',
		JSON.stringify({
			type: 'AssetBrowserData',
			uuid: props.foundryItem().uuid
		})
	)

	CONFIG.IRONSWORN.emitter.emit('dragStart', props.foundryItem().type)
}

function dragEnd() {
	CONFIG.IRONSWORN.emitter.emit('dragEnd', props.foundryItem().type)
}
</script>

<style lang="scss" module>
.wrapper {
	margin: var(--ironsworn-spacer-xl) 0;
	padding: var(--ironsworn-spacer-md);
}
</style>
