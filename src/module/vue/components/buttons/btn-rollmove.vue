<template>
	<IronBtn
		:tooltip="
			$t('IRONSWORN.RollMove', {
				title: getMove().name
			})
		"
		class="action-roll move-roll"
		aria-haspopup="dialog"
		icon="ironsworn:d10-tilt"
		v-bind="($props, $attrs)"
		@click="clickFn($actor, getMove())">
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { IronswornActor } from '../../../actor/actor'
import type { IronswornItem } from '../../../item/item'
import { IronswornPrerollDialog } from '../../../rolls'
import { $ActorKey } from '../../provisions'
import IronBtn from './iron-btn.vue'

interface Props extends Omit<PropsOf<typeof IronBtn>, 'tooltip'> {
	getMove: () => IronswornItem<'sfmove'>
	clickFn?: (
		actor: IronswornActor | undefined,
		move: IronswornItem<'sfmove'>
	) => void
}
const $actor = inject($ActorKey, undefined)

const props = withDefaults(defineProps<Props>(), {
	clickFn: async (
		actor: IronswornActor | undefined,
		move: IronswornItem<'sfmove'>
	) => {
		if (!move) throw new Error('No move?')

		IronswornPrerollDialog.showForMove(move, { actor })
	}
})
</script>
