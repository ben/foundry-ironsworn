<template>
	<div class="flexcol" :aria-label="$t(labelKey)" :class="$style.wrapper">
		<div class="flexrow" :class="$style.commonImpacts">
			<ImpactCategory
				v-for="category in categories"
				:key="category"
				:category="category"
				class="flexcol"
				:class="$style.impactCategory"
				:impacts-class="$style.conditionsContents" />
		</div>
		<div :class="$style.customImpactControls" class="flexcol">
			<div
				v-if="customImpacts?.length"
				class="flexrow"
				:class="$style.customImpacts">
				<ImpactCheckboxCustom
					v-for="impact in customImpacts"
					:key="(impact._id as string)"
					:placeholder="
						$t(`IRONSWORN.${$actor.impactType.toUpperCase()}.Custom`)
					"
					:class="$style.customImpact"
					:status-id="(impact._id as string)"
					:data="impact" />
			</div>
			<IronBtn
				:text="addCustomImpactLabel"
				block
				:icon="'fa:plus'"
				justify="center"
				@click="
					IronActiveEffect.createCustomImpact({
						parent: $actor
					})
				" />
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
	gap: var(--ironsworn-spacer-md);
}
.customImpactControls {
}
.customImpact {
}
.customImpacts {
}

.commonImpacts {
	gap: var(--ironsworn-spacer-lg);

	justify-content: space-between;
}

.impactCategory {
	max-width: max-content;
}
</style>
