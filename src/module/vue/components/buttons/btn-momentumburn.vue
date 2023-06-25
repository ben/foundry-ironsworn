<template>
	<IronBtn
		class="burn-momentum"
		:tooltip="tooltip"
		icon="fa:fire"
		v-bind="($props, $attrs)"
		@click="$actor.system.burnMomentum">
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'

import { $ActorKey } from '../../provisions'
import IronBtn from './iron-btn.vue'
import type { IronswornActor } from '../../../actor/actor'

interface Props extends Omit<PropsOf<typeof IronBtn>, 'tooltip'> {}

defineProps<Props>()
const $actor = inject($ActorKey) as IronswornActor<'character'>

const tooltip = computed(() => {
	const { momentum } = $actor.system
	return game.i18n.format('IRONSWORN.BurnMomentumAndResetTo', momentum as any)
})
</script>
