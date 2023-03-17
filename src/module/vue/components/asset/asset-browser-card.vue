<template>
	<AssetCard
		:collapsible="true"
		class="item-row document"
		draggable="true"
		:data-pack="foundryItem().pack"
		:data-id="foundryItem().id"
		:data-document-id="foundryItem().id"
		:class="{ [`asset-${toolset}`]: true }"
		@dragstart="dragStart"
		@dragend="dragEnd">
		<template #header>
			<AssetHeader class="nogrow flexrow">
				<template #default="{ headerStyles }">
					<FontIcon name="grip" class="nogrow block draggable item" />
					<IronBtn
						:aria-controls="bodyId"
						:class="headerStyles.toggle"
						@click="state.expanded = !state.expanded">
						<template #text>
							<h4 class="button-text" :class="headerStyles.title">
								{{ foundryItem().name }}
							</h4>
						</template>
					</IronBtn>
				</template>
			</AssetHeader>
		</template>
		<template #default="{ styles }">
			<section
				v-if="state.expanded"
				:id="bodyId"
				:class="styles.body"
				class="flexcol"
				:aria-expanded="state.expanded">
				<div
					v-if="system.description"
					v-html="$enrichHtml(system.description ?? '')"></div>
				<div v-html="$enrichHtml(system.requirement ?? '')"></div>
				<div v-if="system.fields?.length" :class="styles.fields">
					<AssetField
						v-for="(field, i) in system.fields"
						:key="i"
						:field="field"
						:readonly="true" />
				</div>
				<ul :class="styles.abilities" class="flexcol">
					<li v-for="(ability, i) in system.abilities" :key="`ability${i}`">
						<AssetAbility :ability="ability" class="flexrow" />
					</li>
				</ul>

				<AssetConditionMeter v-if="system.track.enabled" />
			</section>
		</template>
	</AssetCard>
</template>

<script setup lang="ts">
import type { IAsset } from 'dataforged'
import { computed, inject, provide, reactive } from 'vue'
import type { IronswornItem } from '../../../item/item'
import type { AssetDataPropertiesData } from '../../../item/itemtypes'
import { $ItemKey, ItemKey } from '../../provisions.js'
import FontIcon from '../icon/font-icon.vue'
import IronBtn from '../buttons/iron-btn.vue'
import AssetAbility from './asset-ability.vue'
import AssetField from './asset-field.vue'
import AssetHeader from './asset-header.vue'
import AssetCard from './asset-card.vue'
import AssetConditionMeter from './asset-condition-meter.vue'

const props = defineProps<{
	df?: IAsset
	foundryItem: () => IronswornItem
}>()

const toolset = inject('toolset')
const system = (props.foundryItem() as any).system as AssetDataPropertiesData

provide($ItemKey, props.foundryItem())
provide(
	ItemKey,
	computed(() => props.foundryItem().toObject() as any)
)

const state = reactive({
	expanded: false
})

const bodyId = `asset-body-${props.foundryItem().id}`

function dragStart(ev) {
	ev.dataTransfer.setData(
		'text/plain',
		JSON.stringify({
			type: 'AssetBrowserData',
			uuid: props.foundryItem().uuid
		})
	)

	CONFIG.IRONSWORN.emitter.emit('dragStart', props.foundryItem().type)
}

function dragEnd() {
	CONFIG.IRONSWORN.emitter.emit('dragEnd', props.foundryItem().type)
}
</script>

<style lang="scss" scoped>
.ironsworn .ironsworn__asset {
	--ironsworn-color-thematic: v-bind('system.color');

	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: flex-start;
	margin: var(--ironsworn-spacer-xl) 0;
	padding: var(--ironsworn-spacer-md);
}
</style>
