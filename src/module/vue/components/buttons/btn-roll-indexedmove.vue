<template>
	<IronBtn
		:tooltip="
			$t('IRONSWORN.RollMove', {
				title: props.move?.name
			})
		"
		class="action-roll move-roll"
		aria-haspopup="dialog"
		icon="ironsworn:d10-tilt"
		v-bind="($props, $attrs)"
		@click="clickFn($actor, move)"
	>
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { IronswornActor } from '../../../actor/actor'
import type { IndexedMove } from '../../../features/custommoves.js'
import { IronswornPrerollDialog } from '../../../rolls'
import { $ActorKey } from '../../provisions'
import IronBtn from './iron-btn.vue'
import { IronswornItem } from '../../../item/item'

interface Props
	extends /* @vue-ignore */ Omit<PropsOf<typeof IronBtn>, 'tooltip'> {
	move: IndexedMove
	clickFn?: (actor: IronswornActor | undefined, move: IndexedMove) => void
}
const $actor = inject($ActorKey, undefined)

const props = withDefaults(defineProps<Props>(), {
	clickFn: async (actor: IronswornActor | undefined, move: IndexedMove) => {
		if (!move) throw new Error('No move?')
		if (move.dataforgedMove) {
			IronswornPrerollDialog.showForOfficialMove(move?.dataforgedMove.$id, {
				actor
			})
		} else {
			const moveItem = (await fromUuid(move.uuid)) as IronswornItem<'sfmove'>
			IronswornPrerollDialog.showForMove(moveItem, { actor })
		}
	}
})
</script>
