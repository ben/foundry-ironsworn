<template>
	<AssetCard
		:expanded="expanded"
		:hide-disabled-abilities="true"
		:readonly-fields="true"
		@toggle-expand="toggle">
		<template #headerEnd>
			<div class="flexrow nogrow" :class="$style.controls">
				<BtnDocDelete v-if="editMode" block nogrow :document="$asset" />
				<IronBtn block nogrow icon="fa:pen-to-square" @click="edit" />
			</div>
		</template>
	</AssetCard>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject, provide } from 'vue'
import { $ActorKey, $ItemKey, ActorKey, ItemKey } from '../../provisions'
import IronBtn from 'component:buttons/iron-btn.vue'
import AssetCard from 'component:asset/asset-card.vue'
import BtnDocDelete from '../buttons/btn-doc-delete.vue'
import type { IronswornItem } from '../../../item/item'

const props = defineProps<{ asset: ItemSource<'asset'> }>()
const actor = inject(ActorKey) as Ref

const $actor = inject($ActorKey)
const $asset = (
	$actor
		? $actor?.items.find((x) => x.id === props.asset._id)
		: game.items?.get(props.asset._id as string)
) as IronswornItem<'asset'>

provide($ItemKey, $asset)
provide(
	ItemKey,
	computed(() => props.asset)
)

const expanded = computed(() => {
	return props.asset?.flags['foundry-ironsworn']?.expanded || false
})
const editMode = computed(() => {
	return actor.value.flags['foundry-ironsworn']?.['edit-mode']
})

function toggle() {
	$asset?.setFlag(
		'foundry-ironsworn',
		'expanded',
		!props.asset?.flags['foundry-ironsworn']?.expanded
	)
}
function edit() {
	$asset?.sheet?.render(true)
	return false
}
</script>

<style lang="scss" module>
.controls {
	margin-right: var(--ironsworn-spacer-sm);
}
</style>
