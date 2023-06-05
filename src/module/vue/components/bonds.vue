<template>
	<div class="flexcol nogrow">
		<div class="flexrow">
			<h4>{{ $t('IRONSWORN.ITEMS.TypeBond') }}</h4>
			<IronBtn
				block
				nogrow
				icon="fa:pen-to-square"
				@click="$bonds.sheet?.render(true)" />
			<IronBtn
				block
				nogrow
				icon="ironsworn:d10-tilt"
				@click="$bonds.system.writeEpilogue()" />
		</div>
		<ProgressTrack
			:ticks="bonds.system.bonds.length"
			:rank="null"
			:compact-progress="props.compactProgress" />
	</div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import type { IronswornItem } from '../../item/item'
import { $ActorKey, ActorKey } from '../provisions'
import IronBtn from './buttons/iron-btn.vue'
import ProgressTrack from './progress/progress-track.vue'

const props = defineProps<{ compactProgress?: boolean }>()

const actor = inject(ActorKey)
const $actor = inject($ActorKey)

const bonds = computed(
	() =>
		actor?.value?.items.find(
			(x) => x.type === 'bondset'
		) as ItemSource<'bondset'>
)
const $bonds = computed(
	() => $actor?.itemTypes.bondset[0] as IronswornItem<'bondset'>
)
</script>

<style lang="scss" scoped>
h4 {
	text-transform: uppercase;
}
</style>
