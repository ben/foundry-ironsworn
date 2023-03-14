<template>
	<article :class="$style.card" :aria-expanded="state.expanded">
		<header class="nogrow" :class="$style.header">
			<slot name="headerStart"></slot>
			<button
				v-if="collapsible"
				type="button"
				:aria-controls="bodyId"
				:class="{ [$style.expandToggle]: true, [$style.titleGroup]: true }"
				class="clickable text"
				@click="toggle">
				<h4 :class="$style.title">
					{{ asset.name }}
				</h4>
				<span :class="$style.type" aria-label="asset type">
					{{ asset.system.category }}
				</span>
			</button>
			<div v-else :class="$style.titleGroup">
				<h4 :class="$style.title">
					{{ asset.name }}
				</h4>
				<span :class="$style.type" aria-label="asset type">
					{{ asset.system.category }}
				</span>
			</div>
			<slot name="headerEnd"></slot>
		</header>

		<component
			:is="collapsible ? CollapseTransition : 'section'"
			:id="bodyId"
			:class="$style.body"
			v-bind="bodyProps">
			<div v-if="asset.system.fields?.length" :class="$style.fields">
				<slot
					v-for="(field, i) in asset.system.fields"
					:key="'field' + i"
					name="field"
					:class="$style.field"
					v-bind="{ field, readonly, class: $style.fieldLabel }">
					<AssetField :readonly="readonly" :field="field" :class="class" />
				</slot>
			</div>

			<WithRolllisteners
				v-if="asset.system.description"
				element="div"
				@moveclick="moveClick"
				v-html="$enrichHtml(asset.system.description ?? '')" />

			<WithRolllisteners
				v-if="asset.system.requirement"
				element="div"
				@moveclick="moveClick"
				v-html="$enrichMarkdown(asset.system.requirement ?? '')" />

			<ul :class="$style.abilities" class="flexcol">
				<template
					v-for="(ability, i) in asset.system.abilities"
					:key="'ability' + i">
					<li v-if="ability.enabled || showUncheckedAbilities">
						<slot name="ability" v-bind="{ ability, readonly }"></slot>
					</li>
				</template>
			</ul>

			<slot name="options">
				<template v-if="asset.system.exclusiveOptions > 0">
					<AssetOptions class="nogrow" :readonly="readonly" />
				</template>
			</slot>

			<slot name="conditionMeter">
				<template
					v-if="
						asset.system.track.enabled || asset.system.conditions?.length > 0
					">
					<AssetConditionMeter
						class="nogrow"
						:readonly="readonly"
						:asset="asset" />
				</template>
			</slot>
		</component>
	</article>
</template>

<script lang="ts" setup>
import AssetConditionMeter from 'component:asset/asset-condition-meter.vue'
import AssetOptions from 'component:asset/asset-options.vue'
import WithRolllisteners from 'component:with-rolllisteners.vue'
import { computed, inject, provide, reactive } from 'vue'
import {
	$ActorKey,
	$ItemKey,
	ActorKey,
	ItemKey
} from '../../../../module/vue/provisions'
import AssetField from 'component:asset/asset-field.vue'
import CollapseTransition from 'component:transition/collapse-transition.vue'

const props = withDefaults(
	defineProps<{
		asset: any
		editable?: boolean
		readonly?: boolean
		showUncheckedAbilities?: boolean
		collapsible?: boolean
		/** @default true */
		showAssetType?: boolean
	}>(),
	{ showAssetType: true }
)

const actor = inject(ActorKey)
const $actor = inject($ActorKey)

const asset = props.asset
const $asset = $actor
	? $actor?.items.find((x) => x.id === props.asset._id)
	: game.items?.get(props.asset._id)

provide($ItemKey, $asset)
provide(ItemKey, computed(() => props.asset) as any)

const state = reactive({
	expanded: props.collapsible
		? asset.flags['foundry-ironsworn'].expanded || false
		: undefined
})

function toggle(event: Event) {
	state.expanded = !state.expanded
	if (actor) {
		$asset?.setFlag(
			'foundry-ironsworn',
			'expanded',
			!asset?.flags['foundry-ironsworn']?.expanded
		)
	}
}

const themeColor = computed(() => asset?.system?.color)

const bodyId = computed(() => `asset-body-${$asset?.id}`)

const bodyProps = computed(() => {
	if (!props.collapsible) return {}
	return {
		group: true,
		tag: 'section'
	}
})

function moveClick(item) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}
</script>

<style lang="scss" module>
.card {
	--ironsworn-color-thematic: v-bind(themeColor);

	transition: var(--ironsworn-transition);
	overflow: hidden;
}

.abilities {
	gap: var(--ironsworn-spacer-lg);
	padding-left: var(--ironsworn-spacer-lg);
}

.fields {
	display: flex;
	flex-direction: column;
	margin: 0;
}

.fieldLabel {
}

.body {
	gap: var(--ironsworn-spacer-lg);
	transition: var(--ironsworn-transition);
	padding: var(--ironsworn-spacer-sm);
	overflow: hidden;
}

.header {
	gap: var(--ironsworn-spacer-lg);
	align-items: center;
}

.type {
	flex-grow: 0;
	transition: inherit;
	line-height: 1;
	color: var(--ironsworn-color-thematic);
	font-style: italic;
}

.title {
	transition: inherit;
	margin: 0;
	text-transform: uppercase;
	line-height: 1;
	word-spacing: var(--ironsworn-word-spacing-sm);
	letter-spacing: var(--ironsworn-letter-spacing-sm);
	font-size: var(--font-size-14);
	font-weight: bold;
}

.titleGroup {
}

.expandToggle {
	display: flex;
	flex-flow: row wrap;
	gap: var(--ironsworn-spacer-lg);
	transition: var(--ironsworn-transition);
	box-shadow: none !important;
	background: none;
}
</style>
