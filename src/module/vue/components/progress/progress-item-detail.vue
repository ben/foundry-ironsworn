<template>
	<div v-if="item" class="flexcol">
		<div class="flexrow nogrow" style="margin: 0.5rem 0">
			<RankPips
				:current="foeSystem.rank"
				style="margin-right: 1em"
				@change="setRank" />
			<h4 style="margin: 0; line-height: 22px">
				{{ localizeRank(foeSystem?.rank) }}
			</h4>
			<IronBtn
				v-if="multipleUsers"
				block
				nogrow
				:icon="whisperIcon"
				:data-tooltip="whisperTooltip"
				@click="toggleWhisper" />
			<IronBtn block nogrow icon="fa:trash" @click="clearProgress" />
			<IronBtn block nogrow icon="fa:caret-right" @click="markProgress" />
			<BtnRollprogress block nogrow :item="item" />
		</div>

		<div class="flexrow track nogrow" style="margin-bottom: 1em">
			<ProgressTrack
				:rank="foeSystem.rank"
				:ticks="foeSystem.current"
				data-tooltip-direction="RIGHT" />
		</div>

		<MceEditor v-model="foeSystem.description" @save="saveDescription" />
	</div>
</template>

<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { RANK_INCREMENTS } from '../../../constants'
import type { ProgressDataPropertiesData } from '../../../item/itemtypes'
import { $ActorKey, $ItemKey, ActorKey } from '../../provisions'

import IronBtn from './buttons/iron-btn.vue'
import RankPips from './progress/rank-pips.vue'
import MceEditor from './mce-editor.vue'
import ProgressTrack from './progress/progress-track.vue'
import BtnRollprogress from './buttons/btn-rollprogress.vue'
import { localizeRank } from '../../../helpers/util'

const actor = inject(ActorKey)
const $actor = inject($ActorKey)

const props = defineProps<{ item: any }>()
const $item = $actor?.items.get(props.item._id)
provide($ItemKey, $item)

const foeSystem = computed(
	() => (props.item as any).system as ProgressDataPropertiesData
)

function setRank(rank) {
	$item?.update({ system: { rank } })
}

function clearProgress() {
	$item?.update({ 'system.current': 0 })
}

const multipleUsers = (game.users?.contents?.length ?? 0) > 1
const whisperIcon = computed(() =>
	actor?.value?.flags?.['foundry-ironsworn']?.['muteBroadcast']
		? 'fa:volume-xmark'
		: 'fa:volume'
)

const whisperTooltip = computed(() =>
	actor?.value?.flags?.['foundry-ironsworn']?.['muteBroadcast']
		? 'IRONSWORN.ChatAlert.Muted'
		: 'IRONSWORN.ChatAlert.Unmuted'
)

function toggleWhisper() {
	const current = $actor?.getFlag('foundry-ironsworn', 'muteBroadcast') ?? false
	return $actor?.setFlag('foundry-ironsworn', 'muteBroadcast', !current)
}

function markProgress() {
	const increment = RANK_INCREMENTS[foeSystem.value?.rank]
	const newValue = Math.min(foeSystem.value?.current + increment, 40)
	$item?.update({ 'system.current': newValue })
}

function saveDescription() {
	$item?.update({
		system: { description: foeSystem.value?.description }
	})
}
</script>
