<template>
	<div :class="$style.wrapper">
		<h4>{{ $t(`IRONSWORN.${$capitalize(name)}`) }}</h4>
		<ImpactCheckbox
			v-for="impact in impacts"
			:key="impact.name"
			:name="impact.name"
			:global-hint="impact.globalHint" />
	</div>
</template>

<script lang="ts" setup>
import ImpactCheckbox from './impact-checkbox.vue'

type ImpactData = { globalHint?: boolean; name: string }

defineProps<{ name: string; impacts: ImpactData[] }>()
</script>

<style lang="scss" module>
.wrapper {
}
</style>
