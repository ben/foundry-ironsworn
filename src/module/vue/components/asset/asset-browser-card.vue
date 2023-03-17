<template>
	<article
		class="item-row document ironsworn__asset"
		draggable="true"
		:data-pack="foundryItem().pack"
		:data-id="foundryItem().id"
		:data-document-id="foundryItem().id"
		:class="{ [`asset-${toolset}`]: true }"
		@dragstart="dragStart"
		@dragend="dragEnd">
		<AssetHeader>
			<template #start>
				<FontIcon name="grip" class="nogrow block draggable item" />
			</template>
			<template #title="{ name, cssClass }">
				<IronBtn
					:aria-controls="bodyId"
					class="asset-expand-toggle"
					@click="state.expanded = !state.expanded">
					<template #text>
						<h4 class="button-text" :class="cssClass">
							{{ name }}
						</h4>
					</template>
				</IronBtn>
			</template>
		</AssetHeader>
		<header class="asset-header nogrow flexrow">
			<FontIcon name="grip" class="nogrow block draggable item" />
			<IronBtn
				:aria-controls="bodyId"
				class="asset-expand-toggle"
				@click="state.expanded = !state.expanded">
				<template #text>
					<h4 class="asset-title button-text">
						{{ foundryItem().name }}
					</h4>
				</template>
			</IronBtn>
		</header>

		<CollapseTransition>
			<section
				v-if="state.expanded"
				:id="bodyId"
				class="asset-body flexcol"
				:aria-expanded="state.expanded">
				<div
					v-if="system.description"
					v-html="$enrichHtml(system.description ?? '')"></div>
				<div v-html="$enrichHtml(system.requirement ?? '')"></div>
				<div v-if="system.fields?.length" class="asset-fields">
					<AssetField
						v-for="(field, i) in system.fields"
						:key="i"
						:field="field"
						:readonly="true" />
				</div>
				<ul class="asset-abilities flexcol">
					<li v-for="(ability, i) in system.abilities" :key="`ability${i}`">
						<AssetAbility :ability="ability" class="flexrow" />
					</li>
				</ul>
				<AttrSlider
					v-if="system.track.enabled"
					attr="track"
					document-type="Item"
					slider-style="horizontal"
					:max="system.track.max"
					:current-value="system.track.current"
					:read-only="true">
					<template #label>
						<label>{{ system.track.name }}</label>
					</template>
				</AttrSlider>
			</section>
		</CollapseTransition>
	</article>
</template>

<script setup lang="ts">
import type { IAsset } from 'dataforged'
import { computed, inject, provide, reactive } from 'vue'
import type { IronswornItem } from '../../../item/item'
import type { AssetDataPropertiesData } from '../../../item/itemtypes'
import { $ItemKey, ItemKey } from '../../provisions.js'
import CollapseTransition from '../transition/collapse-transition.vue'
import AttrSlider from '../resource-meter/attr-slider.vue'
import FontIcon from '../icon/font-icon.vue'
import IronBtn from '../buttons/iron-btn.vue'
import AssetAbility from './asset-ability.vue'
import AssetField from './asset-field.vue'

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

function moveClick(item) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}

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
