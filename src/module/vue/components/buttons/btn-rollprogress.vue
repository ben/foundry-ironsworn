<template>
	<IronBtn
		:tooltip="
			$t('IRONSWORN.MakeAProgressRoll', { score: $item?.system.track.score })
		"
		class="progress-roll"
		icon="ironsworn:d10-tilt"
		v-bind="($props, $attrs)"
		@click="$item?.system.rollProgress()">
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script setup lang="ts">
import type { ExtractPropTypes } from 'vue'
import { inject } from 'vue'
import type { IronswornItem } from '../../../item/item'
import { $ItemKey } from '../../provisions'
import IronBtn from './iron-btn.vue'

interface Props extends ExtractPropTypes<typeof IronBtn> {
	item: ItemSource<'progress'>
}

defineProps<Props>()

const $item = inject<IronswornItem<'progress'> | undefined>($ItemKey, undefined)
</script>
