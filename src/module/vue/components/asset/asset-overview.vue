<template>
	<AssetCard class="flexcol" :class="articleClasses">
		<!--
        Semi-edit view:
        * Text entry for field VALUES (not names)
        * Checkboxes for abilities, settable clocks
        * Selection for exclusive options
        * Track: name and value only
        * Conditions: checkboxes only
       -->
		<template #header>
			<AssetHeader class="nogrow flexrow">
				<template #default="{ headerStyles }">
					<span :class="headerStyles.type" aria-label="asset type">
						{{ asset.system.category }}
					</span>
				</template>
			</AssetHeader>
		</template>

		<template #default="{ styles }">
			<section class="flexcol" :class="styles.body">
				<!-- DESCRIPTION -->
				<WithRollListeners
					v-if="asset.system.description"
					element="div"
					class="nogrow"
					@moveclick="moveClick"
					v-html="$enrichHtml(asset.system.description)" />

				<!-- FIELDS -->
				<div v-if="asset.system.fields?.length" :class="$styles.fields">
					<AssetField
						v-for="(field, i) in asset.system.fields"
						:key="i"
						:field="field"
						:update-fn="(delta) => updateField(i, delta)"
						class="nogrow" />
				</div>

				<!-- REQUIREMENT -->
				<p
					v-if="asset.system.requirement"
					class="nogrow"
					v-html="$enrichMarkdown(asset.system.requirement)"></p>

				<!-- ABILITIES -->
				<ul class="flexcol nogrow" :class="styles.abilities">
					<li
						v-for="(ability, i) in asset.system.abilities"
						:key="`ability${i}`">
						<AssetAbility
							:ability="ability"
							:update-fn="(delta) => updateAbility(i, delta)"
							:toggle="true"
							:readonly-clock="true"
							class="flexrow" />
					</li>
				</ul>

				<!-- OPTIONS -->
				<AssetToggle
					v-if="asset.system.exclusiveOptions.length > 0"
					class="flexcol nogrow" />

				<AssetConditionMeter class="flexrow nogrow" />
			</section>
		</template>
	</AssetCard>
</template>

<script lang="ts" setup>
import type { ComputedRef } from 'vue'
import { computed, inject, useCssModule } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'
import type {
	AssetAbility as AssetAbilityType,
	AssetField as AssetFieldType
} from '../../../item/itemtypes'
import WithRollListeners from '../with-rolllisteners.vue'
import AssetAbility from './asset-ability.vue'
import AssetField from './asset-field.vue'
import AssetHeader from './asset-header.vue'
import AssetCard from './asset-card.vue'
import AssetConditionMeter from './asset-condition-meter.vue'
import AssetToggle from './asset-toggle.vue'

const $asset = inject($ItemKey)
const asset = inject(ItemKey) as ComputedRef

const toolset = computed<'ironsworn' | 'starforged' | undefined>(
	() => $asset?.actor?.toolset ?? 'ironsworn'
)

const cssModule = useCssModule()
const articleClasses = computed(() => ({
	[cssModule.ironsworn__asset]: true,
	[`asset-${toolset.value ?? 'ironsworn'}`]: true,
	[`asset-${toolset.value}`]: true
}))

async function updateAbility(index: number, delta: Partial<AssetAbilityType>) {
	const abilities = Object.values(
		asset.value.system.abilities
	) as AssetAbilityType[]
	abilities[index] = mergeObject(abilities[index], delta) as AssetAbilityType
	return $asset?.update({ system: { abilities } })
}

async function updateField(index: number, delta: Partial<AssetFieldType>) {
	const fields = Object.values(asset.value.system.fields) as AssetFieldType[]
	fields[index] = mergeObject(fields[index], delta) as AssetFieldType
	return $asset?.update({ system: { fields } })
}

function moveClick(item) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}
</script>

<style lang="scss" module>
.ironsworn__asset {
	--ironsworn-color-thematic: v-bind('asset.system.color');

	margin: var(--ironsworn-spacer-xl) 0;
	padding: var(--ironsworn-spacer-md);
}
</style>
