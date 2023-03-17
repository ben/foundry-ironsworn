<template>
	<article
		class="ironsworn__asset"
		:class="{
			[`asset-${$actor?.toolset}`]: true,
			[$style.themeColor]: props.asset?.system?.color
		}"
		:aria-expanded="expanded">
		<header class="asset-header nogrow flexrow">
			<button
				type="button"
				:aria-controls="bodyId"
				class="clickable text asset-expand-toggle"
				@click="toggle">
				<h4 class="asset-title">
					{{ asset.name }}
				</h4>
				<span class="asset-type" aria-label="asset type">
					{{ asset.system.category }}
				</span>
			</button>
			<div class="asset-controls flexrow nogrow">
				<IronBtn
					v-if="editMode"
					block
					nogrow
					icon="fa:trash"
					@click="destroy" />
				<IronBtn block nogrow icon="fa:pen-to-square" @click="edit" />
			</div>
		</header>

		<CollapseTransition>
			<section
				v-if="expanded"
				:id="bodyId"
				class="asset-body flexcol"
				:aria-expanded="expanded">
				<with-rolllisteners
					v-if="asset.system.description"
					element="div"
					@moveclick="moveclick"
					v-html="$enrichHtml(asset.system.description ?? '')" />
				<with-rolllisteners
					v-if="asset.system.requirement"
					element="div"
					@moveclick="moveclick"
					v-html="$enrichHtml(asset.system.requirement ?? '')" />

				<div v-if="asset.system.fields?.length" class="asset-fields">
					<AssetField
						v-for="(field, i) in asset.system.fields"
						:key="i"
						:field="field"
						:readonly="true" />
				</div>
				<ul class="asset-abilities flexcol">
					<template v-for="(ability, i) in asset.system.abilities">
						<li v-if="ability.enabled" :key="`ability${i}`">
							<AssetAbility
								:ability="ability"
								:update-fn="(delta) => updateAbility(i, delta)"
								class="flexrow" />
						</li>
					</template>
				</ul>

				<div v-if="asset.system.track.enabled" class="flexrow nogrow">
					<ConditionMeterSlider
						slider-style="horizontal"
						class="asset-condition-meter"
						document-type="Item"
						attr="track.current"
						:current-value="asset.system.track.current"
						:max="asset.system.track.max"
						:min="0"
						:stat-label="asset.system.track.name"
						label-position="left"
						:read-only="false" />
					<AssetConditions :asset="asset" />
				</div>

				<section
					v-if="asset.system.exclusiveOptions.length > 0"
					class="flexcol stack nogrow">
					<asset-exclusiveoption
						v-for="(opt, i) in asset.system.exclusiveOptions"
						:key="'option' + i"
						:opt="opt"
						@click="exclusiveOptionClick(i)" />
				</section>
			</section>
		</CollapseTransition>
	</article>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject, provide } from 'vue'
import type {
	AssetAbility as AssetAbilityType,
	AssetDataPropertiesData
} from '../../../item/itemtypes'
import AssetExclusiveoption from './asset-exclusiveoption.vue'
import WithRolllisteners from '../with-rolllisteners.vue'
import { $ActorKey, $ItemKey, ActorKey, ItemKey } from '../../provisions'
import { defaultActor } from '../../../helpers/actors'
import CollapseTransition from '../transition/collapse-transition.vue'
import ConditionMeterSlider from '../resource-meter/condition-meter.vue'
import AssetConditions from './asset-conditions.vue'
import IronBtn from '../buttons/iron-btn.vue'
import AssetAbility from './asset-ability.vue'
import AssetField from './asset-field.vue'

const props = defineProps<{ asset: any }>()
const actor = inject(ActorKey) as Ref

const $actor = inject($ActorKey)
const foundryItem = $actor
	? $actor?.items.find((x) => x.id === props.asset._id)
	: game.items?.get(props.asset._id)

provide($ItemKey, foundryItem)
provide(
	ItemKey,
	computed(() => props.asset)
)

const bodyId = computed(() => `asset-body-${props.asset?._id}`)

const expanded = computed(() => {
	return props.asset?.flags['foundry-ironsworn']?.expanded || false
})
const editMode = computed(() => {
	return actor.value.flags['foundry-ironsworn']?.['edit-mode']
})
const enabledAbilities = computed(() => {
	const data = props.asset.system as AssetDataPropertiesData
	const abilities = Object.values(data.abilities)
	return abilities.filter((x) => x.enabled)
})
const actingActor = computed(() => {
	if (actor.value.type === 'character') return actor.value
	return defaultActor()?.toObject(false)
})

function toggle() {
	foundryItem?.setFlag(
		'foundry-ironsworn',
		'expanded',
		!props.asset?.flags['foundry-ironsworn']?.expanded
	)
}
function edit() {
	foundryItem?.sheet?.render(true)
	return false
}
function destroy() {
	Dialog.confirm({
		title: game.i18n.format('DOCUMENT.Delete', {
			type: game.i18n.localize('IRONSWORN.ITEM.TypeAsset')
		}),
		yes: () => foundryItem?.delete(),
		defaultYes: false
	})
}
function exclusiveOptionClick(selectedIdx) {
	const options = props.asset.system.exclusiveOptions
	for (let i = 0; i < options.length; i++) {
		options[i].selected = i === selectedIdx
	}
	foundryItem?.update({ system: { exclusiveOptions: options } })
}
function moveclick(item) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}
async function updateAbility(
	abilityIdx: number,
	delta: Partial<AssetAbilityType>
) {
	const abilities = Object.values(
		props.asset.system.abilities
	) as AssetAbilityType[]

	abilities[abilityIdx] = mergeObject(
		abilities[abilityIdx],
		delta
	) as AssetAbilityType
	await foundryItem?.update({ system: { abilities } })
}

function toggleCondition(idx: number) {
	const { conditions } = props.asset.system
	conditions[idx].ticked = !conditions[idx].ticked
	foundryItem?.update({ system: { conditions } })
}
</script>

<style lang="scss" module>
.themeColor {
	--ironsworn-color-thematic: v-bind('asset?.system?.color');
}
</style>
