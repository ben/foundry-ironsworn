<template>
	<IronBtn
		class="oracle-roll"
		:tooltip="
			$t('IRONSWORN.RollOracleTable', { title: props.node.displayName })
		"
		icon="ironsworn:oracle"
		v-bind="($props, $attrs)"
		@click="rollOracle">
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script setup lang="ts">
import { sample } from 'lodash-es'
import type { ExtractPropTypes } from 'vue'
import { inject } from 'vue'
import type { IOracleTreeNode } from '../../../features/customoracles.js'
import type { OracleTable } from '../../../roll-table/oracle-table'
import IronBtn from './iron-btn.vue'

interface Props extends Omit<ExtractPropTypes<typeof IronBtn>, 'tooltip'> {}

const props = defineProps<{
	node: IOracleTreeNode
	overrideClick?: boolean
	// Hack: if we declare `click` in the emits, there's no $attrs['onClick']
	// This allows us to check for presence and still use $emit('click')
	// https://github.com/vuejs/core/issues/4736#issuecomment-934156497
	onClick?: Function
}>()

const toolset = inject<'ironsworn' | 'starforged'>('toolset')
const $emit = defineEmits(['click'])

async function rollOracle() {
	if (props.overrideClick && props.onClick) return $emit('click')

	const randomTableUuid = sample(props.node.tables)
	if (!randomTableUuid) return

	const table = (await fromUuid(randomTableUuid)) as OracleTable | undefined

	await table?.draw({ displayChat: true })
}
</script>
