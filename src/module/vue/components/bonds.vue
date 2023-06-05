<template>
	<div class="flexcol nogrow">
		<div class="flexrow">
			<h4>{{ $t('IRONSWORN.ITEMS.TypeBond') }}</h4>
			<IronBtn block nogrow icon="fa:pen-to-square" @click="editBonds" />
			<IronBtn block nogrow icon="ironsworn:d10-tilt" @click="rollBonds" />
		</div>
		<ProgressTrack
			:ticks="bondcount"
			:rank="null"
			:compact-progress="props.compactProgress" />
	</div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import { $ActorKey, ActorKey } from '../provisions'
import IronBtn from './buttons/iron-btn.vue'
import ProgressTrack from './progress/progress-track.vue'

const props = defineProps<{ compactProgress?: boolean }>()

const actor = inject(ActorKey)
const $actor = inject($ActorKey)

const bonds = computed(() => {
	return actor?.value?.items.find(
		(x) => x.type === 'bondset'
	) as ItemSource<'bondset'>
})
const bondcount = computed(() => {
	if (bonds?.value?.system.bonds == null) return 0
	return Object.values(bonds?.value?.system.bonds).length
})

function editBonds() {
	const item = $actor?.items.get(bonds?.value?._id as string)
	item?.sheet?.render(true)
}
function rollBonds() {
	const item = $actor?.items.get(bonds?.value?._id as string)
	item?.writeEpilogue()
}
</script>

<style lang="scss" scoped>
h4 {
	text-transform: uppercase;
}
</style>
