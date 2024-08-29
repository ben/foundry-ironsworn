<template>
	<div class="flexrow nogrow" :class="$style.wrapper">
		<IronBtn
			:class="$style.btn"
			block
			icon="fa:plus"
			:text="$t('IRONSWORN.ITEM.SubtypeVow')"
			@click="addProgressItem('vow')"
		/>
		<IronBtn
			:class="$style.btn"
			block
			icon="fa:plus"
			:text="$t('IRONSWORN.ITEM.SubtypeProgress')"
			@click="addProgressItem('progress')"
		/>
		<IronBtn
			:class="$style.btn"
			block
			icon="fa:book-atlas"
			:text="$t('IRONSWORN.Foes')"
			@click="openFoeBrowser"
		/>
	</div>
</template>
<script setup lang="ts">
import { inject } from 'vue'
import { $ActorKey } from '../../provisions'
import { FoeBrowser } from '../../../item/foe-browser'

import IronBtn from 'component:buttons/iron-btn.vue'

const $actor = inject($ActorKey)

async function addProgressItem(subtype) {
	const itemData = {
		name: subtype.capitalize(),
		type: 'progress',
		data: { subtype },
		sort: 9000000
	}
	const item = await Item.create(itemData as any, { parent: $actor })
	item?.sheet?.render(true)
}

function openFoeBrowser() {
	new FoeBrowser().render(true)
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
