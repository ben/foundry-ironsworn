<template>
	<IronBtn
		class="burn-momentum"
		:tooltip="tooltip"
		icon="fa:fire"
		v-bind="($props, $attrs)"
		@click="burnMomentum">
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { ExtractPropTypes } from 'vue'
import { inject } from 'vue'
import type { CharacterData } from '../../../actor/config'
import { $ActorKey } from '../../provisions'
import IronBtn from './iron-btn.vue'

interface Props extends Omit<ExtractPropTypes<typeof IronBtn>, 'tooltip'> {}

defineProps<Props>()
const $actor = inject($ActorKey)

const tooltip = computed(() => {
	const { momentum, momentumReset } = $actor?.system as CharacterData
	return game.i18n.format('IRONSWORN.BurnMomentumAndResetTo', {
		value: momentum,
		resetValue: momentumReset
	})
})

const burnMomentum = () => $actor?.burnMomentum()
</script>
