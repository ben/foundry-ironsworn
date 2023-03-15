<template>
	<div :class="$style.wrapper">
		<h4>{{ $t(`IRONSWORN.${$capitalize(name)}`) }}</h4>
		<ConditionCheckbox
			v-for="impact in impacts"
			:key="impact.name"
			:name="impact.name"
			:global-hint="impact.globalHint" />
	</div>
</template>

<style lang="scss" module>
.wrapper {
}
</style>

<script lang="ts" setup>
import ConditionCheckbox from './impact-checkbox.vue'

type ImpactData = { globalHint?: boolean; name: string }

defineProps<{ name: string; impacts: ImpactData[] }>()
</script>
