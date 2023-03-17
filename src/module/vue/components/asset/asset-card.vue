<template>
	<article :class="$style.wrapper">
		<slot name="header"></slot>
		<CollapseTransition>
			<section :class="$style.body" class="flexcol">
				<!-- FIELDS -->
				<section v-if="asset.system.fields?.length" :class="$style.fields">
					<AssetField
						v-for="(field, i) in asset.system.fields"
						:key="i"
						:field="field"
						:update-fn="(delta) => updateField(i, delta)"
						class="nogrow"
						:readonly="readonlyFields" />
				</section>

				<!-- DESCRIPTION -->
				<WithRolllisteners
					v-if="asset.system.description"
					element="div"
					class="nogrow"
					v-html="$enrichHtml(asset.system.description)" />

				<!-- REQUIREMENT -->
				<p
					v-if="asset.system.requirement"
					class="nogrow"
					v-html="$enrichMarkdown(asset.system.requirement)"></p>

				<!-- ABILITIES -->
				<ul class="flexcol nogrow" :class="$style.abilities">
					<template
						v-for="(ability, i) in asset.system.abilities"
						:key="`ability${i}`">
						<li v-if="showDisabledAbilities ?? ability.enabled">
							<AssetAbility
								:ability="ability"
								:update-fn="(delta) => updateAbility(i, delta)"
								:toggle="toggleAbilities"
								:readonly-clock="readonlyClocks"
								class="flexrow" />
						</li>
					</template>
				</ul>

				<AssetToggle
					v-if="asset.system.exclusiveOptions.length > 0"
					class="flexcol nogrow" />

				<AssetConditionMeter v-if="asset.system.track" class="flexrow nogrow" />
			</section>
		</CollapseTransition>
	</article>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { inject } from 'vue'
import { ItemKey, $ItemKey, ActorKey, $ActorKey } from '../../provisions'
import CollapseTransition from '../transition/collapse-transition.vue'
import WithRolllisteners from '../with-rolllisteners.vue'
import AssetConditionMeter from './asset-condition-meter.vue'
import AssetToggle from './asset-toggle.vue'
import type {
	AssetAbility as AssetAbilityType,
	AssetField as AssetFieldType
} from '../../../item/itemtypes'
import AssetAbility from './asset-ability.vue'
import AssetField from './asset-field.vue'

const asset = inject(ItemKey) as Ref
const $asset = inject($ItemKey)

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

defineProps<{
	collapsible?: boolean
	readonlyClocks?: boolean
	readonlyFields?: boolean
	toggleAbilities?: boolean
	showDisabledAbilities?: boolean
}>()

async function updateAbility(index: number, delta: Partial<AssetAbilityType>) {
	if (!actor.value) return
	const abilities = Object.values(
		asset.value.system.abilities
	) as AssetAbilityType[]
	abilities[index] = mergeObject(abilities[index], delta) as AssetAbilityType
	return $asset?.update({ system: { abilities } })
}

async function updateField(index: number, delta: Partial<AssetFieldType>) {
	if (!actor.value) return
	const fields = Object.values(asset.value.system.fields) as AssetFieldType[]
	fields[index] = mergeObject(fields[index], delta) as AssetFieldType
	return $asset?.update({ system: { fields } })
}
</script>

<style lang="scss" module>
.wrapper {
	--ironsworn-color-thematic: v-bind(asset?.system.color);
	transition: var(--ironsworn-transition);
	overflow: hidden;
}

.body {
	gap: var(--ironsworn-spacer-lg);
	transition: var(--ironsworn-transition);
	padding: var(--ironsworn-spacer-sm);
	overflow: hidden;
}

.fields {
	display: flex;
	flex-direction: column;
	margin: 0;
}

.abilities {
	gap: var(--ironsworn-spacer-sm);
	margin: 0;
	padding: var(--ironsworn-spacer-sm) 0;
	list-style: none;
	justify-items: stretch;
	> li {
		display: contents;
		> * {
			width: 100%;
		}
	}
}
</style>
