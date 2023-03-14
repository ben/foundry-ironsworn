<template>
	<div
		v-if="asset.system.conditions?.length > 0"
		:class="$style.assetconditions">
		<label
			v-for="(condition, i) in asset.system.conditions"
			:key="condition.name"
			:class="$style.condition">
			<input
				type="checkbox"
				:checked="condition.ticked"
				@change="toggleCondition(i)" />
			{{ condition.name }}
		</label>
	</div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { $ItemKey } from '../../provisions'

const props = defineProps<{ asset: any }>()

const $item = inject($ItemKey)

async function toggleCondition(idx: number) {
	const { conditions } = props.asset.system
	conditions[idx].ticked = !conditions[idx].ticked
	await $item?.update({ system: { conditions } })

	CONFIG.IRONSWORN.emitter.emit('globalConditionChanged', {
		name: conditions[idx].name.toLowerCase(),
		enabled: conditions[idx].ticked
	})
}
</script>

<style lang="less" module>
.assetconditions {
	display: flex;
	flex-direction: column;
	flex-grow: 0;
	justify-content: space-around;
	margin: var(--ironsworn-spacer-md);
}

.condition {
	--ironsworn-checkbox-size: 12px;

	flex-basis: var(--ironsworn-checkbox-size);
	margin: var(--ironsworn-border-width-md) 0;
	line-height: var(--ironsworn-checkbox-size);
	white-space: nowrap;
	font-size: x-small;

	input[type='checkbox'] {
		flex: 0 0 var(--ironsworn-checkbox-size);
		margin: 0 var(--ironsworn-spacer-sm);
		width: var(--ironsworn-checkbox-size);
		height: var(--ironsworn-checkbox-size);
		vertical-align: bottom;
	}
}
</style>
