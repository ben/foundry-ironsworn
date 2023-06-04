<template>
	<div v-if="item" class="flexcol">
		<div class="flexrow nogrow" style="margin: 0.5rem 0">
			<RankPips
				:current="item?.system.rank"
				style="margin-right: 1em"
				@change="(rank) => $item?.update({ system: { rank } })" />
			<h4 style="margin: 0; line-height: 22px">
				{{ localizeRank(item?.system.rank) }}
			</h4>
			<IronBtn
				v-if="multipleUsers"
				block
				nogrow
				:icon="whisperIcon"
				:data-tooltip="whisperTooltip"
				@click="toggleWhisper" />
			<IronBtn
				block
				nogrow
				icon="fa:trash"
				@click="$item?.update({ system: { current: 0 } })" />
			<IronBtn
				block
				nogrow
				icon="fa:caret-right"
				@click="$item?.system.markProgress" />
			<BtnRollprogress block nogrow :item="item" />
		</div>

		<div class="flexrow track nogrow" style="margin-bottom: 1em">
			<ProgressTrack
				:rank="item?.system.rank"
				:ticks="item?.system.current"
				data-tooltip-direction="RIGHT" />
		</div>

		<MceEditor v-model="item.system.description" @save="saveDescription" />
	</div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject, provide } from 'vue'
import { $ActorKey, $ItemKey, ActorKey } from '../../provisions'

import IronBtn from 'component:buttons/iron-btn.vue'
import RankPips from 'component:progress/rank-pips.vue'
import MceEditor from 'component:mce-editor.vue'
import ProgressTrack from 'component:progress/progress-track.vue'
import BtnRollprogress from 'component:buttons/btn-rollprogress.vue'
import { localizeRank } from '../../../helpers/util'
import type { IronswornItem } from '../../../item/item'
import type { IronswornActor } from '../../../actor/actor'

const actor = inject<Ref<ActorSource<'foe'>>>(ActorKey)
const $actor = inject<IronswornActor<'foe'>>($ActorKey)

const props = defineProps<{ item: ItemSource<'progress'> }>()
const $item = $actor?.items.get(
	props.item._id as string
) as IronswornItem<'progress'>
provide($ItemKey, $item as IronswornItem)

const multipleUsers = (game.users?.contents?.length ?? 0) > 1
const whisperIcon = computed(() =>
	actor?.value?.flags?.['foundry-ironsworn']?.muteBroadcast
		? 'fa:volume-xmark'
		: 'fa:volume'
)

const whisperTooltip = computed(() =>
	actor?.value?.flags?.['foundry-ironsworn']?.muteBroadcast
		? 'IRONSWORN.ChatAlert.Muted'
		: 'IRONSWORN.ChatAlert.Unmuted'
)

function toggleWhisper() {
	const current = $actor?.getFlag('foundry-ironsworn', 'muteBroadcast') ?? false
	return $actor?.setFlag('foundry-ironsworn', 'muteBroadcast', !current)
}

function saveDescription() {
	$item?.update({
		system: { description: props.item.system.description }
	})
}
</script>
