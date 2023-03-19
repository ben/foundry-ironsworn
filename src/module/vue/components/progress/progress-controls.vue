<template>
	<div class="flexrow nogrow" :class="$style.wrapper">
		<IronBtn
			:class="$style.btn"
			block
			icon="fa:plus"
			:text="$t('IRONSWORN.ITEM.SubtypeVow')"
			@click="addProgressItem('vow')" />
		<IronBtn
			:class="$style.btn"
			block
			icon="fa:plus"
			:text="$t('IRONSWORN.ITEM.SubtypeProgress')"
			@click="addProgressItem('progress')" />
		<btn-compendium
			:class="$style.btn"
			block
			:compendium="props.foeCompendium ?? 'ironswornfoes'"
			:text="$t('IRONSWORN.Foes')" />
	</div>
</template>
<script setup lang="ts">
import { capitalize, inject } from 'vue'
import { $ActorKey } from '../../provisions'
import IronBtn from './buttons/iron-btn.vue'
import BtnCompendium from './buttons/btn-compendium.vue'

const props = defineProps<{ foeCompendium?: string }>()

const $actor = inject($ActorKey)

async function addProgressItem(subtype) {
	const itemData = {
		name: capitalize(subtype),
		type: 'progress',
		data: { subtype },
		sort: 9000000
	}
	const item = await Item.create(itemData as any, { parent: $actor })
	item?.sheet?.render(true)
}
</script>

<style lang="scss" module>
.wrapper {
	//
}

.btn {
	--ironsworn-line-height: var(--ironsworn-line-height-sm);
}
</style>
