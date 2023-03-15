<template>
	<div :class="$style.wrapper" :aria-labelledby="`title_${baseId}`">
		<h4 :id="`title_${baseId}`" :class="$style.title">
			{{ $t(`IRONSWORN.${type.toUpperCase()}.CATEGORY.${$capitalize(name)}`) }}
		</h4>
		<div :class="impactsClass">
			<ImpactCheckbox
				v-for="impact in impacts"
				:key="impact.name"
				:type="type"
				:name="impact.name"
				:global-hint="impact.globalHint" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import { ActorKey } from '../../provisions'
import ImpactCheckbox from './impact-checkbox.vue'

type ImpactData = { globalHint?: boolean; name: string }

const props = withDefaults(
	defineProps<{
		name: string
		type: 'debility' | 'impact'
		impacts: ImpactData[]
		impactsClass?: any
	}>(),
	{ impactsClass: {} }
)

const actor = inject(ActorKey) as Ref

const baseId = computed(() => `impacts_${props.name}_${actor.value._id}`)
</script>

<style lang="scss" module>
.wrapper {
}

.title {
	flex-grow: 0;
	margin: var(--ironsworn-spacer-sm) 0;
}
</style>
