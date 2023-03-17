<template>
	<article :class="$style.card" :aria-labelledby="titleId">
		<slot name="deco">
			<svg
				v-if="deco"
				:class="$style.deco"
				tabindex="-1"
				role="presentational"
				aria-hidden="true"
				:height="deco.height"
				:width="deco.width"
				fill="var(--ironsworn-color-thematic)">
				<use :href="deco.href" />
			</svg>
		</slot>
		<slot name="header">
			<header :class="$style.header">
				<slot name="headerStart"></slot>

				<template v-if="isCollapsible">
					<slot name="title" v-bind="{ styles: $style, titleId }">
						<button
							:id="titleId"
							type="button"
							:aria-controls="bodyId"
							:class="$style.toggle"
							class="clickable text"
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
		</slot>
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
					v-html="$enrichHtml(asset.system.description)" />

				<!-- REQUIREMENT -->
				<WithRolllisteners
					v-if="asset.system.requirement"
					element="p"
					class="nogrow"
					v-html="$enrichMarkdown(asset.system.requirement)" />

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
import { IronswornSettings } from '../../../helpers/settings'

const asset = inject(ItemKey) as Ref
const $asset = inject($ItemKey)

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const props = withDefaults(
	defineProps<{
		/**
		 * Leave undefined to disable expand/collapse behaviour.
		 */
		expanded?: boolean
		readonlyClocks?: boolean
		readonlyFields?: boolean
		toggleAbilities?: boolean
		showDisabledAbilities?: boolean
	}>(),
	{ showDisabledAbilities: true }
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

const deco = computed(() => {
	if (IronswornSettings.starforgedToolsEnabled) {
		return { href: '#ironsworn-hex-deco', height: 24, width: 28 }
	}
	return undefined
})

const $emit = defineEmits<{
	(name: 'toggleExpand', isExpanded: boolean): void
}>()

// TODO: have it pass a toggle function instead?
function toggleExpand() {
	if (typeof props.expanded !== 'boolean') return
	$emit('toggleExpand', !!props.expanded)
}

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
.card {
	--ironsworn-color-thematic: v-bind(asset?.system.color);

	display: flex;
	position: relative;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	transition: var(--ironsworn-transition);
	overflow: hidden;
}

.deco {
	position: aboslute;
	top: 0;
	right: 0;
	flex: unset;
	z-index: 0;
	margin: calc(-1 * var(--ironsworn-spacer-xs));
	// width: 24px;
	// height: 28px;
	color: var(--ironsworn-color-thematic);
	pointer-events: none;
	// aspect-ratio: calc(24 / 28);
}

.header {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	gap: var(--ironsworn-spacer-lg);
}

.toggle {
	display: flex;
	flex-flow: row wrap;
	gap: var(--ironsworn-spacer-lg);
	transition: var(--ironsworn-transition);
	box-shadow: none !important;
	background: none;
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

.type {
	flex-grow: 1;
	transition: inherit;
	text-align: left;
	line-height: 1;
	color: var(--ironsworn-color-thematic);
	font-style: italic;
}

.body {
	gap: var(--ironsworn-spacer-lg);
	transition: var(--ironsworn-transition);
	padding: var(--ironsworn-spacer-sm);
	overflow: hidden;
}

.fields {
	margin: 0;
}

.abilities {
	gap: var(--ironsworn-spacer-sm);
	justify-items: stretch;
	margin: 0;
	padding: var(--ironsworn-spacer-sm) 0;
	list-style: none;
	> li {
		display: contents;
		> * {
			width: 100%;
		}
	}
}
</style>
