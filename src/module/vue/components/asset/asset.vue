<template>
	<AssetCard
		:collapsible="true"
		:class="{
			[`asset-${$actor?.toolset}`]: true,
			[$style.themeColor]: props.asset?.system?.color
		}"
		:aria-expanded="expanded">
		<template #header>
			<AssetHeader class="nogrow flexrow">
				<template #default="{ headerStyles }">
					<button
						type="button"
						:aria-controls="bodyId"
						:class="headerStyles.toggle"
						class="clickable text"
						@click="toggle">
						<h4 :class="headerStyles.title">
							{{ asset.name }}
						</h4>
						<span :class="headerStyles.type" aria-label="asset type">
							{{ asset.system.category }}
						</span>
					</button>
					<div class="flexrow nogrow" :class="$style.controls">
						<IronBtn
							v-if="editMode"
							block
							nogrow
							icon="fa:trash"
							@click="destroy" />
						<IronBtn block nogrow icon="fa:pen-to-square" @click="edit" />
					</div>
				</template>
			</AssetHeader>
		</template>
		<template #default="{ styles }">
			<section
				v-if="expanded"
				:id="bodyId"
				:class="styles.body"
				class="flexcol"
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

				<div v-if="asset.system.fields?.length" :class="styles.fields">
					<AssetField
						v-for="(field, i) in asset.system.fields"
						:key="i"
						:field="field"
						:readonly="true" />
				</div>
				<ul class="flexcol" :class="styles.abilities">
					<template v-for="(ability, i) in asset.system.abilities">
						<li v-if="ability.enabled" :key="`ability${i}`">
							<AssetAbility
								:ability="ability"
								:update-fn="(delta) => updateAbility(i, delta)"
								class="flexrow" />
						</li>
					</template>
				</ul>

				<AssetConditionMeter
					v-if="asset.system.track.enabled"
					class="flexrow nogrow" />

				<AssetToggle
					v-if="asset.system.exclusiveOptions.length"
					class="flexcol nogrow" />
			</section>
		</template>
	</AssetCard>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject, provide } from 'vue'
import type { AssetAbility as AssetAbilityType } from '../../../item/itemtypes'
import AssetExclusiveoption from './asset-exclusiveoption.vue'
import WithRolllisteners from '../with-rolllisteners.vue'
import { $ActorKey, $ItemKey, ActorKey, ItemKey } from '../../provisions'
import IronBtn from '../buttons/iron-btn.vue'
import AssetAbility from './asset-ability.vue'
import AssetField from './asset-field.vue'
import AssetHeader from './asset-header.vue'
import AssetCard from './asset-card.vue'
import AssetConditionMeter from './asset-condition-meter.vue'
import AssetToggle from './asset-toggle.vue'

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
</script>

<style lang="scss" module>
.themeColor {
	--ironsworn-color-thematic: v-bind('asset?.system?.color');
}

.controls {
	justify-items: flex-end;
}
</style>
