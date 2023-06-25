<template>
	<IronBtn
		class="oracle-roll"
		:tooltip="$t('IRONSWORN.RollOracleTable', { title: name })"
		icon="ironsworn:oracle"
		v-bind="($props, $attrs)"
		@click="rollOracle">
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script setup lang="ts">
import { OracleTable } from '../../../roll-table/oracle-table'
import IronBtn from './iron-btn.vue'

interface Props extends Omit<PropsOf<typeof IronBtn>, 'tooltip'> {
	name: string

	oracleId: string
	overrideClick?: boolean
	// Hack: if we declare `click` in the emits, there's no $attrs['onClick']
	// This allows us to check for presence and still use $emit('click')
	// https://github.com/vuejs/core/issues/4736#issuecomment-934156497
	onClick?: Function
}

const props = defineProps<Props>()

const $emit = defineEmits(['click'])

async function rollOracle() {
	if (props.overrideClick && props.onClick) return $emit('click')

	OracleTable.ask(props.oracleId)
}
</script>
