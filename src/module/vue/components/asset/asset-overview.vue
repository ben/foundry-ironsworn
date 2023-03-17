<template>
	<article class="flexcol ironsworn__asset" :class="articleClasses">
		<!--
        Semi-edit view:
        * Text entry for field VALUES (not names)
        * Checkboxes for abilities, settable clocks
        * Selection for exclusive options
        * Track: name and value only
        * Conditions: checkboxes only
       -->

		<header class="asset-header nogrow">
			<span class="asset-type" aria-label="asset type">
				{{ item.system.category }}
			</span>
		</header>

		<section class="asset-body flexcol">
			<!-- DESCRIPTION -->
			<WithRollListeners
				v-if="item.system.description"
				element="div"
				class="nogrow"
				@moveclick="moveClick"
				v-html="$enrichHtml(item.system.description)" />

			<!-- FIELDS -->
			<div v-if="item.system.fields?.length" class="asset-fields">
				<AssetField
					v-for="(field, i) in item.system.fields"
					:key="i"
					:field="field"
					:update-fn="(delta) => updateField(i, delta)"
					class="form-group nogrow" />
			</div>

			<!-- REQUIREMENT -->
			<p
				v-if="item.system.requirement"
				class="nogrow"
				v-html="$enrichMarkdown(item.system.requirement)"></p>

			<!-- ABILITIES -->
			<ul class="asset-abilities flexcol nogrow">
				<li v-for="(ability, i) in item.system.abilities" :key="`ability${i}`">
					<AssetAbility
						:ability="ability"
						:update-fn="(delta) => updateAbility(i, delta)"
						:toggle="true"
						:readonly-clock="true"
						class="flexrow" />
				</li>
			</ul>

			<!-- OPTIONS -->
			<section
				v-if="item.system.exclusiveOptions.length > 0"
				class="flexcol stack nogrow">
				<AssetExclusiveoption
					v-for="(opt, i) in item.system.exclusiveOptions"
					:key="'option' + i"
					:opt="opt"
					@click="exclusiveOptionClick(i)" />
			</section>

			<div class="flexrow nogrow">
				<!-- TRACK -->
				<ConditionMeterSlider
					v-if="item.system.track.enabled"
					slider-style="horizontal"
					class="asset-condition-meter"
					document-type="Item"
					attr="track.current"
					:current-value="item.system.track.current"
					:max="item.system.track.max"
					:min="0"
					:stat-label="item.system.track.name"
					label-position="left"
					:read-only="false" />

				<!-- CONDITIONS -->
				<AssetConditions :asset="item" />
			</div>
		</section>
	</article>
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
import ConditionMeterSlider from '../resource-meter/condition-meter.vue'
import AssetExclusiveoption from './asset-exclusiveoption.vue'
import AssetConditions from './asset-conditions.vue'
import AssetAbility from './asset-ability.vue'
import AssetField from './asset-field.vue'

const $item = inject($ItemKey)
const item = inject(ItemKey) as ComputedRef

const toolset = computed<'ironsworn' | 'starforged' | undefined>(
	() => $item?.actor?.toolset ?? 'ironsworn'
)

const cssModule = useCssModule()
const articleClasses = computed(() => ({
	[cssModule.ironsworn__asset]: true,
	[`asset-${toolset.value ?? 'ironsworn'}`]: true,
	[`asset-${toolset.value}`]: true
}))

async function updateAbility(index: number, delta: Partial<AssetAbilityType>) {
	const abilities = Object.values(
		item.value.system.abilities
	) as AssetAbilityType[]
	abilities[index] = mergeObject(abilities[index], delta) as AssetAbilityType
	return $item?.update({ system: { abilities } })
}

async function updateField(index: number, delta: Partial<AssetFieldType>) {
	const fields = Object.values(item.value.system.fields) as AssetFieldType[]
	fields[index] = mergeObject(fields[index], delta) as AssetFieldType
	return $item?.update({ system: { fields } })
}

function exclusiveOptionClick(selectedIdx: number) {
	const { exclusiveOptions } = item.value.system
	for (let i = 0; i < exclusiveOptions.length; i++) {
		exclusiveOptions[i].selected = i === selectedIdx
	}
	$item?.update({ system: { exclusiveOptions } })
}

function moveClick(item) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}
</script>

<style lang="scss" module>
.ironsworn__asset {
	--ironsworn-color-thematic: v-bind('item.system.color');

	margin: var(--ironsworn-spacer-xl) 0;
	padding: var(--ironsworn-spacer-md);
}
</style>
