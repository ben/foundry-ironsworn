<template>
	<div class="flexcol" :aria-label="$t(labelKey)" :class="$style.wrapper">
		<div class="flexrow" :class="$style.commonImpacts">
			<ImpactCategory
				v-for="category in categories"
				:key="category"
				:category="category"
				class="flexcol"
				:class="$style.conditions"
				:impacts-class="$style.conditionsContents" />
		</div>
		<div :class="$style.customImpacts" class="flexcol">
			<div v-if="customImpacts?.length" class="flexrow">
				<ImpactCheckboxCustom
					v-for="impact in customImpacts"
					:key="(impact._id as string)"
					:placeholder="
						$t(`IRONSWORN.${$actor.impactType.toUpperCase()}.Custom`)
					"
					:status-id="(impact._id as string)"
					:data="impact" />
			</div>
			<IronBtn
				:text="addCustomImpactLabel"
				:icon="'fa:plus'"
				justify="center"
				@click="addCustomImpact" />
		</div>
	</div>
</template>

<script setup lang="ts">
import ImpactCheckboxCustom from './impact-checkbox-custom.vue'
import ImpactCategory from './impact-category.vue'
import { $ActorKey, ActorKey } from '../../provisions'
import type { IronswornActor } from '../../../actor/actor'
import { inject, computed } from 'vue'
import type { ImpactFlags } from '../../../active-effect/config'
import IronBtn from '../buttons/iron-btn.vue'
import { IronActiveEffect } from '../../../active-effect/active-effect'

const $actor = inject($ActorKey) as IronswornActor<'character'>

const actor = inject(ActorKey)

const labelKey = computed(
	() => `IRONSWORN.${$actor.impactType === 'impact' ? 'Impacts' : 'Debilities'}`
)

const customImpacts = computed(() =>
	actor?.value.effects.filter((ae) =>
		(ae as any).statuses.some((statusId: string) =>
			statusId.startsWith(
				CONFIG.IRONSWORN.IronActiveEffect.CUSTOM_IMPACT_PREFIX
			)
		)
	)
)

const addCustomImpactLabel = computed(() =>
	game.i18n.format(`DOCUMENT.New`, {
		type: game.i18n.localize(
			`IRONSWORN.${$actor.impactType.toUpperCase()}.Custom`
		)
	})
)

function addCustomImpact() {
	$actor.createEmbeddedDocuments('ActiveEffect', [
		{
			name: game.i18n.localize(
				`IRONSWORN.${$actor.impactType.toUpperCase()}.Custom`
			),
			statuses: [
				`${IronActiveEffect.CUSTOM_IMPACT_PREFIX}:${
					$actor.customImpacts.length + 1
				}`
			]
		}
	])
}

const categories = computed(() => {
	const result = new Set<ImpactFlags['category'] & string>()

	for (const fx of $actor?.validImpacts ?? []) {
		if (
			fx.flags?.['foundry-ironsworn']?.type === 'impact' &&
			typeof fx.flags?.['foundry-ironsworn']?.category === 'string'
		)
			result.add(fx.flags?.['foundry-ironsworn']?.category)
	}

	return result
})
</script>

<style lang="scss" module>
.wrapper {
}
.customImpacts {
}

.commonImpacts {
	gap: var(--ironsworn-spacer-lg);
}
</style>
