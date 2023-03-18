<template>
	<AssetCard
		:asset="asset().toObject()"
		:class="$style.wrapper"
		:expanded="state.expanded"
		class="document"
		draggable="true"
		:data-pack="asset().pack"
		:data-id="asset().id"
		:data-document-id="asset().id"
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
	asset: () => IronswornItem
}>()

provide($ItemKey, props.asset())
provide(
	ItemKey,
	computed(() => props.asset().toObject() as any)
)

const state = reactive({
	expanded: false
})

function dragStart(ev) {
	ev.dataTransfer.setData(
		'text/plain',
		JSON.stringify({
			type: 'AssetBrowserData',
			uuid: props.asset().uuid
		})
	)

	CONFIG.IRONSWORN.emitter.emit('dragStart', props.asset().type)
}

function dragEnd() {
	CONFIG.IRONSWORN.emitter.emit('dragEnd', props.asset().type)
}
</script>

<style lang="scss" module>
.wrapper {
	margin: var(--ironsworn-spacer-xl) 0;
	padding: var(--ironsworn-spacer-md);

	border-width: var(--ironsworn-border-width-md);
	border-style: solid;
	border-radius: var(--ironsworn-border-radius-sm);
	border-color: var(--ironsworn-color-border);
}
</style>
