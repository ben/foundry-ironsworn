<template>
	<IronBtn
		:tooltip="
			$t('IRONSWORN.RollMove', {
				title: props.move?.displayName
			})
		"
		class="action-roll move-roll"
		aria-haspopup="dialog"
		icon="ironsworn:d10-tilt"
		v-bind="($props, $attrs)"
		@click="rollMove">
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { Move } from '../../../features/custommoves.js'
import { IronswornPrerollDialog } from '../../../rolls'
import { $ActorKey } from '../../provisions'
import IronBtn from './iron-btn.vue'

interface Props extends Omit<PropsOf<typeof IronBtn>, 'tooltip'> {
	move?: Move
	overrideClick?: boolean

	// Hack: if we declare `click` in the emits, there's no $attrs['onClick']
	// This allows us to check for presence and still use $emit('click')
	// https://github.com/vuejs/core/issues/4736#issuecomment-934156497
	onClick?: Function
}

const props = defineProps<Props>()

const $actor = inject($ActorKey)
const $emit = defineEmits(['click'])

async function rollMove() {
	if (props.overrideClick && props.onClick) return $emit('click')
	if (!props.move) throw new Error('No move?')
	if (props.move.dataforgedMove)
		return IronswornPrerollDialog.showForOfficialMove(
			props.move?.dataforgedMove.$id,
			{ actor: $actor }
		)
	IronswornPrerollDialog.showForMove(props.move.moveItem(), { actor: $actor })
}
</script>
