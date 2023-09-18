<template>
	<div class="flexcol">
		<SheetHeaderBasic :document="data.actor" class="nogrow" />
		<ProgressItemDetail v-if="foe" :item="foe" />

		<DropTarget
			is="div"
			v-else
			drop-type="progress"
			class="flexcol"
			:class="$style.dropTarget">
			<IronBtn
				v-if="multipleUsers"
				block
				nogrow
				:icon="whisperIcon"
				:data-tooltip="whisperTooltip"
				:text="$t('IRONSWORN.ChatAlert.ToggleMute')"
				@click="toggleWhisper" />
			<IronBtn
				block
				nogrow
				icon="fa:file"
				:text="$t('IRONSWORN.ITEM.TypeProgressTrack')"
				@click="addEmpty" />
			<BtnCompendium
				block
				nogrow
				compendium="ironswornfoes"
				:text="`${$t('IRONSWORN.Foes')} (Ironsworn)`" />
			<BtnCompendium
				block
				nogrow
				compendium="starforgedencounters"
				:text="`${$t('IRONSWORN.Foes')} (Starforged)`" />
		</DropTarget>
	</div>
</template>

<script setup lang="ts">
import SheetHeaderBasic from '../sheet-header-basic.vue'
import { computed, inject, provide } from 'vue'
import type { IronswornActor } from '../../actor/actor'
import { $ActorKey, ActorKey } from '../provisions'
import IronBtn from './buttons/iron-btn.vue'
import BtnCompendium from './buttons/btn-compendium.vue'
import DropTarget from '../drop-target.vue'
import ProgressItemDetail from 'component:progress/progress-item-detail.vue'
import type { SourceData } from '../../fields/utils'

const props = defineProps<{
	data: {
		actor: SourceData<IronswornActor, 'foe'>
	}
}>()
provide(ActorKey, computed(() => props.data.actor) as any)
const foe = computed(() => {
	return props.data.actor.items.find((x) => x.type === 'progress')
})

const $actor = inject($ActorKey)

function addEmpty() {
	Item.create(
		{
			name: 'NPC',
			type: 'progress',
			system: { progressTrack: { subtype: 'foe' } }
		},
		{ parent: $actor }
	)
}

const multipleUsers = (game.users?.contents?.length ?? 0) > 1
const whisperIcon = computed(() =>
	(props.data.actor.flags['foundry-ironsworn'] as any)?.muteBroadcast
		? 'fa:volume-xmark'
		: 'fa:volume'
)

const whisperTooltip = computed(() =>
	(props.data.actor.flags['foundry-ironsworn'] as any)?.muteBroadcast
		? 'IRONSWORN.ChatAlert.Muted'
		: 'IRONSWORN.ChatAlert.Unmuted'
)

function toggleWhisper() {
	const current = $actor?.getFlag('foundry-ironsworn', 'muteBroadcast') ?? false
	return $actor?.setFlag('foundry-ironsworn', 'muteBroadcast', !current)
}
</script>

<style lang="scss" module>
.dropTarget {
	justify-items: space-around;
	text-align: center;

	button {
		padding: 1rem;
	}
}
</style>
