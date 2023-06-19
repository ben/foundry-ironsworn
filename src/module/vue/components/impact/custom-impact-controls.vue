<template>
	<div :class="$style.wrapper">
		<div v-if="customImpacts?.length" :class="$style.impacts">
			<ImpactCheckboxCustom
				v-for="impact in customImpacts"
				:key="(impact._id as string)"
				:placeholder="$t(`IRONSWORN.${$actor.impactType.toUpperCase()}.Custom`)"
				:class="$style.impact"
				:status-id="(impact._id as string)"
				:data="impact" />
		</div>
		<IronBtn
			:text="$t(`IRONSWORN.${$actor.impactType.toUpperCase()}.Custom`)"
			block
			:icon="'fa:plus'"
			justify="center"
			:aria-label="
				$t(`DOCUMENT.New`, {
					type: $t(`IRONSWORN.${$actor.impactType.toUpperCase()}.Custom`)
				})
			"
			@click="
				IronActiveEffect.createCustomImpact({
					parent: $actor
				})
			" />
	</div>
</template>

<script lang="ts" setup>
import ImpactCheckboxCustom from './impact-checkbox-custom.vue'
import { $ActorKey, ActorKey } from '../../provisions'
import type { IronswornActor } from '../../../actor/actor'
import { inject, computed } from 'vue'
import IronBtn from '../buttons/iron-btn.vue'
import { IronActiveEffect } from '../../../active-effect/active-effect'

const $actor = inject($ActorKey) as IronswornActor<'character'>

const actor = inject(ActorKey)

const customImpacts = computed(() =>
	actor?.value.effects.filter(
		(ae) => ae.flags['foundry-ironsworn']?.isCustomImpact
	)
)
</script>

<style lang="scss" module>
.wrapper {
}
.impacts {
	display: contents;
}
.impact {
}
</style>
