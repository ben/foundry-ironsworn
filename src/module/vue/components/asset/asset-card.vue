<template>
	<article
		:class="{
			[$style.card]: true,
			[$style.decorated]: !!deco,
			[$style.undecorated]: !deco
		}"
		:aria-labelledby="titleId">
		<slot name="deco">
			<svg
				v-if="deco"
				:class="$style.decoration"
				tabindex="-1"
				role="presentational"
				aria-hidden="true"
				:width="deco.width"
				:height="deco.height">
				<use :href="deco.href" />
			</svg>
		</slot>

		<header :class="$style.header">
			<slot name="headerStart"></slot>

			<template v-if="isCollapsible === true">
				<slot name="title" v-bind="{ styles: $style, titleId }">
					<button
						:id="titleId"
						type="button"
						:aria-controls="bodyId"
						:class="$style.expandToggle"
						class="clickable text flexrow"
						@click="toggleExpand">
						<h4 :class="$style.title">
							{{ asset.name }}
						</h4>
						<span :class="$style.type" aria-label="asset type">
							{{ asset.system.category }}
						</span>
					</button>
				</slot>
			</template>

			<template v-else>
				<slot name="title" v-bind="{ styles: $style }"></slot>

				<slot name="type">
					<span :class="$style.type" aria-label="asset type">
						{{ asset.system.category }}
					</span>
				</slot>
			</template>

			<slot name="headerEnd"></slot>
		</header>

		<CollapseTransition>
			<section
				v-if="expanded ?? !isCollapsible"
				:id="bodyId"
				:class="$style.body"
				class="flexcol"
				:aria-expanded="expanded">
				<!-- FIELDS -->
				<section
					v-if="asset.system.fields?.length"
					:class="$style.fields"
					class="flexcol nogrow">
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
					:class="$style.requirement"
					v-html="$enrichHtml(asset.system.description)" />

				<!-- REQUIREMENT -->
				<WithRolllisteners
					v-if="asset.system.requirement"
					element="div"
					class="nogrow"
					:class="$style.requirement"
					v-html="$enrichMarkdown(asset.system.requirement)" />

				<!-- ABILITIES -->
				<ul class="flexcol nogrow" :class="$style.abilities">
					<template
						v-for="(ability, i) in asset.system.abilities"
						:key="`ability${i}`">
						<li v-if="hideDisabledAbilities ? ability.enabled : true">
							<AssetAbility
								:class="$style.ability"
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
					class="flexrow nogrow" />

				<AssetConditionMeter v-if="asset.system.track" class="flexrow nogrow" />
			</section>
		</CollapseTransition>
	</article>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import { ItemKey, $ItemKey, ActorKey, $ActorKey } from '../../provisions'
import CollapseTransition from 'component:transition/collapse-transition.vue'
import WithRolllisteners from 'component:with-rolllisteners.vue'
import AssetConditionMeter from 'component:asset/asset-condition-meter.vue'
import AssetToggle from 'component:asset/asset-toggle.vue'
import type {
	AssetAbility as AssetAbilityType,
	AssetField as AssetFieldType
} from '../../../item/itemtypes'
import AssetAbility from 'component:asset/asset-ability.vue'
import AssetField from 'component:asset/asset-field.vue'
import { IronswornSettings } from '../../../helpers/settings'

const asset = inject(ItemKey) as Ref
const $asset = inject($ItemKey)

const props = withDefaults(
	defineProps<{
		/**
		 * Leave undefined to disable expand/collapse behaviour.
		 */
		expanded?: boolean
		readonlyClocks?: boolean
		readonlyFields?: boolean
		toggleAbilities?: boolean
		hideDisabledAbilities?: boolean
	}>(),
	{ hideDisabledAbilities: false, expanded: undefined }
)
const isCollapsible = computed(() => typeof props.expanded === 'boolean')

const baseId = computed(
	() =>
		`asset_${isCollapsible.value ? 'collapsible' : 'fullview'}_${
			asset.value._id
		}`
)

const bodyId = computed(() => `body_${baseId.value}`)

const titleId = computed(() => `title_${baseId.value}`)

const deco = computed(() => IronswornSettings.deco.asset.header)

const $emit = defineEmits<{
	(name: 'toggleExpand', isExpanded: boolean): void
}>()

// TODO: have it pass a toggle function instead?
function toggleExpand() {
	if (typeof props.expanded !== 'boolean') return
	$emit('toggleExpand', !!props.expanded)
}

async function updateAbility(index: number, delta: Partial<AssetAbilityType>) {
	if (!$asset?.actor) return
	const abilities = Object.values(
		asset.value.system.abilities
	) as AssetAbilityType[]
	abilities[index] = mergeObject(abilities[index], delta) as AssetAbilityType
	return $asset?.update({ system: { abilities } })
}

async function updateField(index: number, delta: Partial<AssetFieldType>) {
	if (!$asset?.actor) return
	const fields = Object.values(asset.value.system.fields) as AssetFieldType[]
	fields[index] = mergeObject(fields[index], delta) as AssetFieldType
	return $asset?.update({ system: { fields } })
}
</script>

<style lang="scss" module>
.card {
	--ironsworn-color-thematic: v-bind(asset?.system.color);
	--ironsworn-asset-header-row: 1;
	--ironsworn-asset-body-row: 2;
	--ironsworn-asset-header-column: 1;
	--ironsworn-asset-header-height: 28px;

	display: grid;
	// gap: var(--ironsworn-spacer-sm);
	grid-template-rows: max-content;
	grid-auto-rows: 1fr;
	transition: var(--ironsworn-transition);
	overflow: hidden;
}

.undecorated {
	--ironsworn-asset-body-column: 1;

	grid-template-columns: 1fr;
}
.decorated {
	--ironsworn-asset-deco-row: 1;
	--ironsworn-asset-deco-column: 2;
	--ironsworn-asset-body-column: 1 / span 2;

	grid-template-columns: 1fr max-content;
}

.decoration {
	grid-row: var(--ironsworn-asset-deco-row);
	grid-column: var(--ironsworn-asset-deco-column);
	z-index: 0;
	pointer-events: none;
	fill: var(--ironsworn-color-thematic);
}

.header {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	grid-row: var(--ironsworn-asset-header-row);
	grid-column: var(--ironsworn-asset-header-column);
	gap: var(--ironsworn-spacer-lg);
	align-items: center;
	min-height: var(--ironsworn-asset-header-height);
}

.readonly {
	pointer-events: none;
}

.expandToggle {
	flex-grow: 1;
	gap: var(--ironsworn-spacer-lg);
	transition: var(--ironsworn-transition);
	box-shadow: none !important;
	background: none;
	height: 100%;
	align-content: center;
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
	flex-grow: 0;
	white-space: nowrap;
}

.type {
	flex-grow: 1;
	transition: inherit;
	text-align: left;
	line-height: 1;
	color: var(--ironsworn-color-thematic);
	font-style: italic;
}
.body {
	grid-row: var(--ironsworn-asset-body-row);
	grid-column: var(--ironsworn-asset-body-column);
	gap: var(--ironsworn-spacer-lg);
	transition: var(--ironsworn-transition);
	padding: 0 var(--ironsworn-spacer-md) var(--ironsworn-spacer-md);
	overflow: hidden;
}

.requirement {
	> * {
		&:first-child {
			margin-top: 0;
		}
		&:last-child {
			margin-bottom: 0;
		}
	}
}

.fields {
	margin: 0;
}

.abilities {
	gap: var(--ironsworn-spacer-sm);
	margin: 0;
	padding: 0;
	list-style: none;
	> li {
		display: contents;
		> * {
		}
	}
}
.ability {
	padding: var(--ironsworn-spacer-xs);
	width: 100%;
}
</style>
