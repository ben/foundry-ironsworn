<template>
	<SheetBasic :document="data.actor">
		<template #before-header>
			<div class="flexrow nogrow" style="gap: var(--ironsworn-spacer-md)">
				<!-- Region -->
				<label
					class="flexrow"
					style="flex-basis: 150px; gap: var(--ironsworn-spacer-xl)"
				>
					<span class="select-label">{{ $t('IRONSWORN.Region') }}</span>
					<select v-model="region" @change="regionChanged">
						<option v-for="r in regions" :value="r.value">
							{{ $t(r.label) }}
						</option>
					</select>
				</label>

				<!-- Subtype -->
				<label
					class="flexrow"
					style="flex-basis: 200px; gap: var(--ironsworn-spacer-xl)"
				>
					{{ $t('IRONSWORN.LocationType') }}
					<select v-model="data.actor.system.subtype" @change="subtypeChanged">
						<option v-for="st in subtypes" :value="st.value">
							{{ st.label }}
						</option>
					</select>
				</label>
			</div>

			<!-- Klass -->
			<label
				class="flexrow nogrow"
				style="position: relative; gap: var(--ironsworn-spacer-xl)"
				v-if="klassOptions.length > 0"
			>
				<!-- TODO: i18n and subtype text -->
				<span class="select-label">{{ subtypeSelectText }}:</span>
				<select
					v-model="data.actor.system.klass"
					:class="{
						highlighted: state.firstLookHighlight && firstLookWillRandomizeKlass
					}"
					@change="klassChanged"
				>
					<option
						v-for="opt in klassOptions"
						:key="opt.value"
						:value="opt.value"
					>
						{{ opt.label }}
					</option>
				</select>
				<IronBtn
					block
					nogrow
					icon="ironsworn:d10-tilt"
					style="
						position: absolute;
						top: 1px;
						right: 15px;
						padding: 0 var(--ironsworn-spacer-md);
						height: 25px;
						line-height: 30px;
					"
					:tooltip="randomKlassTooltip"
					@click="randomizeKlass"
				/>
			</label>
		</template>
		<template #header>
			<SheetHeaderBasic
				:document="data.actor"
				class="sf-location-header nogrow"
				:name-class="{
					highlighted: state.firstLookHighlight && firstLookWillRandomizeName
				}"
				@change="nameChange"
			>
				<IronBtn
					v-if="canRandomizeName"
					class="btn-randomize-name"
					block
					nogrow
					:tooltip="$t('IRONSWORN.RandomName')"
					icon="ironsworn:d10-tilt"
					@click="randomizeName"
				/>
			</SheetHeaderBasic>
		</template>

		<section v-if="oracles.length > 0" class="boxgroup flexcol nogrow">
			<div class="flexrow boxrow">
				<div class="box flexrow">
					<IronBtn
						block
						icon="ironsworn:d10-tilt"
						:text="$t('IRONSWORN.RollForDetails')"
						@click="rollFirstLook"
						@mouseenter="state.firstLookHighlight = true"
						@mouseleave="state.firstLookHighlight = false"
					/>
				</div>
			</div>
			<div v-for="(row, i) of oracles" :key="`row${i}`" class="flexrow boxrow">
				<div v-for="(oracle, x) of row" :key="`oracle${x}`" class="box flexrow">
					<IronBtn
						:key="oracle.dsid"
						block
						:disabled="oracle.requiresKlass && klassIsNotValid"
						:class="{
							highlighted: oracle.fl && state.firstLookHighlight
						}"
						:tooltip="
							oracle.requiresKlass && klassIsNotValid
								? $t('IRONSWORN.RequiresLocationType')
								: undefined
						"
						icon="ironsworn:d10-tilt"
						@click="rollOracle(oracle)"
					>
						<template #text>
							{{ oracle.title }}
							<span v-if="oracle.qty" class="oracle-quantity"
								>({{ oracle.qty }})</span
							>
						</template>
					</IronBtn>
				</div>
			</div>
		</section>
		<section class="flexcol">
			<MceEditor
				v-model="data.actor.system.description"
				@save="saveDescription"
			/>
		</section>
	</SheetBasic>
</template>

<script setup lang="ts">
import SheetHeaderBasic from './sheet-header-basic.vue'
import { flatten } from 'lodash-es'
import { provide, computed, reactive, inject } from 'vue'
import { $ActorKey, ActorKey } from './provisions'
import { OracleTable } from '../roll-table/oracle-table'
import { IdParser } from '../datasworn2'

import MceEditor from './components/mce-editor.vue'
import SheetBasic from './sheet-basic.vue'
import IronBtn from './components/buttons/iron-btn.vue'
import { IronswornSettings } from '../helpers/settings'

const props = defineProps<{
	data: { actor: ActorSource<'location'> }
}>()

provide(ActorKey, computed(() => props.data.actor) as any)
const $actor = inject($ActorKey)

const sceneId = game.user?.viewedScene
const scene = game.scenes?.get(sceneId ?? '')
const region =
	(scene?.getFlag('foundry-ironsworn', 'region') as string) || 'terminus'
const state = reactive({
	region,
	firstLookHighlight: false
})

type Selectable = {
	label: string
	value: string
}

const regions: Selectable[] = []
const subtypes: Selectable[] = []
for (const ruleset of IronswornSettings.enabledRulesets) {
	if (ruleset === 'starforged') {
		regions.push(
			{
				label: game.i18n.localize('IRONSWORN.REGION.Terminus'),
				value: 'terminus'
			},
			{
				label: game.i18n.localize('IRONSWORN.REGION.Outlands'),
				value: 'outlands'
			},
			{
				label: game.i18n.localize('IRONSWORN.REGION.Expanse'),
				value: 'expanse'
			}
		)
		subtypes.push(
			{ value: 'planet', label: 'Planet' },
			{ value: 'settlement', label: 'Settlement' },
			{ value: 'star', label: 'Stellar' },
			{ value: 'derelict', label: 'Derelict' },
			{ value: 'vault', label: 'Precursor' }
		)
	}
	if (ruleset === 'sundered_isles') {
		regions.push(
			{
				label: game.i18n.localize('IRONSWORN.REGION.Myriads'),
				value: 'myriads'
			},
			{
				label: game.i18n.localize('IRONSWORN.REGION.Margins'),
				value: 'margins'
			},
			{
				label: game.i18n.localize('IRONSWORN.REGION.Reaches'),
				value: 'reaches'
			}
		)
		subtypes.push(
			{ value: 'island', label: 'Island' },
			{ value: 'sunderedsettlement', label: 'Settlement' }
		)
	}
}

function randomImage(subtype, klass): string | void {
	if (subtype === 'planet') {
		const name = klass.capitalize()
		const i = Math.floor(Math.random() * 2) + 1
		return `systems/foundry-ironsworn/assets/planets/Starforged-Planet-Token-${name}-0${i}.webp`
	}
	if (subtype === 'settlement') {
		return `systems/foundry-ironsworn/assets/locations/settlement-${klass.replace(
			/\s+/,
			''
		)}.webp`
	}
	if (subtype === 'derelict') {
		return `systems/foundry-ironsworn/assets/locations/derelict-${klass.replace(
			/\s+/,
			''
		)}.webp`
	}
	if (subtype === 'vault') {
		return `systems/foundry-ironsworn/assets/locations/vault-${klass.replace(
			/\s+/,
			''
		)}.webp`
	}
	if (subtype === 'sunderedsettlement') {
		return `systems/foundry-ironsworn/assets/icons/settlement-si.svg`
	}
	if (subtype === 'island') {
		return `systems/foundry-ironsworn/assets/icons/island.svg`
	}
}

const klassOptions = computed((): { value: string; label: string }[] => {
	switch (props.data.actor.system.subtype) {
		case 'planet':
			return [
				{ value: 'desert', label: 'Desert World' },
				{ value: 'furnace', label: 'Furnace World' },
				{ value: 'grave', label: 'Grave World' },
				{ value: 'ice', label: 'Ice World' },
				{ value: 'jovian', label: 'Jovian World' },
				{ value: 'jungle', label: 'Jungle World' },
				{ value: 'ocean', label: 'Ocean World' },
				{ value: 'rocky', label: 'Rocky World' },
				{ value: 'shattered', label: 'Shattered World' },
				{ value: 'tainted', label: 'Tainted World' },
				{ value: 'vital', label: 'Vital World' }
			]

		case 'settlement':
		case 'derelict':
		case 'vault':
			return [
				{ value: 'planetside', label: 'Planetside' },
				{ value: 'orbital', label: 'Orbital' },
				{ value: 'deep space', label: 'Deep Space' }
			]

		case 'star':
			return [
				{ value: 'smoldering red star', label: 'Smoldering Red Star' },
				{ value: 'glowing orange star', label: 'Glowing Orange Star' },
				{ value: 'burning yellow star', label: 'Burning Yellow Star' },
				{ value: 'blazing blue star', label: 'Blazing Blue Star' },
				{
					value: 'young star incubating in a molecular cloud',
					label: 'Young Star'
				},
				{
					value: 'white dwarf shining with spectral light',
					label: 'White Dwarf'
				},
				{
					value: 'corrupted star radiating with unnatural light',
					label: 'Corrupted Star'
				},
				{
					value: 'neutron star surrounded by intense magnetic fields',
					label: 'Neutron Star'
				},
				{
					value:
						'two stars in close orbit connected by fiery tendrils of energy',
					label: 'Binary Stars'
				},
				{
					value: 'black hole allows nothing to escape—not even light',
					label: 'Black Hole'
				},
				{
					value: 'hypergiant star generating turbulent solar winds',
					label: 'Hypergiant'
				},
				{
					value: 'artificial star constructed by a long-dead civilization',
					label: 'Artificial Star'
				},
				{
					value: 'unstable star showing signs of impending supernova',
					label: 'Unstable Star'
				}
			]

		case 'sunderedsettlement':
			return [
				{ value: 'shore', label: 'Shore' },
				{ value: 'inland', label: 'Inland' },
				{ value: 'waterside', label: 'Waterside' }
			]

		default:
			return []
	}
})

interface OracleSpec {
	title: string
	dsid: string
	qty?: string
	fl?: boolean
	requiresKlass?: boolean
}
const oracles = computed((): OracleSpec[][] => {
	const { subtype, klass } = props.data.actor.system
	const kc = klass
	const rc = state.region
	switch (subtype) {
		case 'planet':
			return [
				[
					{
						title: 'Atmosphere',
						dsid: `oracle_rollable:starforged/planet/${kc}/atmosphere`,
						fl: true,
						requiresKlass: true
					},
					{
						title: 'Observed from space',
						qty: '1-2',
						dsid: `oracle_rollable:starforged/planet/${kc}/observed_from_space`,
						fl: true,
						requiresKlass: true
					}
				],
				[
					{
						title: 'Settlements',
						dsid: `oracle_rollable:starforged/planet/${kc}/settlements/${rc}`,
						fl: true,
						requiresKlass: true
					},
					{
						title: 'Life',
						dsid: `oracle_rollable:starforged/planet/${kc}/life`,
						requiresKlass: true
					},
					{
						title: 'Planetside feature',
						qty: '1-2',
						dsid: `oracle_rollable:starforged/planet/${kc}/feature`,
						requiresKlass: true
					}
				],
				[
					{
						title: 'Peril (life)',
						dsid: `oracle_rollable:starforged/planet/peril/lifebearing`
					},
					{
						title: 'Opportunity (life)',
						dsid: `oracle_rollable:starforged/planet/opportunity/lifebearing`
					}
				],
				[
					{
						title: 'Peril (lifeless)',
						dsid: `oracle_rollable:starforged/planet/peril/lifeless`
					},
					{
						title: 'Opportunity (lifeless)',
						dsid: `oracle_rollable:starforged/planet/opportunity/lifeless`
					}
				]
			]

		case 'settlement':
			return [
				[
					{
						title: 'Population',
						dsid: `oracle_rollable:starforged/settlement/population/${rc}`,
						fl: true
					},
					{
						title: 'First look',
						dsid: 'oracle_rollable:starforged/settlement/first_look',
						qty: '1-2',
						fl: true
					}
				],
				[
					{
						title: 'Initial contact',
						dsid: 'oracle_rollable:starforged/settlement/initial_contact'
					},
					{
						title: 'Authority',
						dsid: 'oracle_rollable:starforged/settlement/authority'
					}
				],
				[
					{
						title: 'Settlement projects',
						dsid: 'oracle_rollable:starforged/settlement/projects'
					},
					{
						title: 'Settlement trouble',
						dsid: 'oracle_rollable:starforged/settlement/trouble'
					}
				]
			]

		case 'star':
			return [] // TODO

		case 'derelict':
			return [
				[
					{
						title: 'Type',
						dsid: `oracle_rollable:starforged/derelict/type/${kc}`,
						fl: true,
						requiresKlass: true
					},
					{
						title: 'Condition',
						dsid: `oracle_rollable:starforged/derelict/condition`,
						fl: true
					}
				],
				[
					{
						title: 'Outer first look',
						dsid: `oracle_rollable:starforged/derelict/outer_first_look`,
						fl: true
					},
					{
						title: 'Inner first look',
						dsid: `oracle_rollable:starforged/derelict/inner_first_look`
					}
				]
			]

		case 'vault':
			return [
				[
					{
						title: 'Scale',
						dsid: `oracle_rollable:starforged/precursor_vault/scale`,
						fl: true
					},
					{
						title: 'Form',
						dsid: `oracle_rollable:starforged/precursor_vault/form`,
						fl: true
					},
					{
						title: 'Shape',
						dsid: `oracle_rollable:starforged/precursor_vault/shape`,
						fl: true
					}
				],
				[
					{
						title: 'Material',
						dsid: `oracle_rollable:starforged/precursor_vault/material`,
						fl: true
					},
					{
						title: 'Outer first look',
						dsid: `oracle_rollable:starforged/precursor_vault/outer_first_look`,
						fl: true
					}
				],
				[
					{
						title: 'Interior first look',
						dsid: `oracle_rollable:starforged/precursor_vault/interior/first_look`
					},
					{
						title: 'Interior feature',
						dsid: `oracle_rollable:starforged/precursor_vault/interior/feature`
					},
					{
						title: 'Interior peril',
						dsid: `oracle_rollable:starforged/precursor_vault/interior/peril`
					},
					{
						title: 'Interior opportunity',
						dsid: `oracle_rollable:starforged/precursor_vault/interior/opportunity`
					}
				],
				[
					{
						title: 'Sanctum purpose',
						dsid: `oracle_rollable:starforged/precursor_vault/sanctum/purpose`
					},
					{
						title: 'Sanctum feature',
						dsid: `oracle_rollable:starforged/precursor_vault/sanctum/feature`
					},
					{
						title: 'Sanctum peril',
						dsid: `oracle_rollable:starforged/precursor_vault/sanctum/peril`
					},
					{
						title: 'Sanctum opportunity',
						dsid: `oracle_rollable:starforged/precursor_vault/sanctum/opportunity`
					}
				]
			]

		case 'island':
			return [
				[
					{
						title: 'Island size',
						dsid: `oracle_rollable:sundered_isles/island/landscape/size`,
						fl: true
					},
					{
						title: 'Terrain',
						dsid: `oracle_rollable:sundered_isles/island/landscape/terrain`,
						fl: true
					},
					{
						title: 'Vitality',
						dsid: `oracle_rollable:sundered_isles/island/landscape/vitality/${rc}`,
						fl: true
					}
				],
				[
					{
						title: 'Habitation',
						dsid: `oracle_rollable:sundered_isles/island/visible_habitation/${rc}`
					},
					{
						title: 'Nearby Islands',
						dsid: `oracle_rollable:sundered_isles/island/nearby_islands/${rc}`
					}
				],
				[
					{
						title: 'Coastline Aspect',
						qty: '1-2',
						dsid: `oracle_rollable:sundered_isles/island/coastline_aspects`
					},
					{
						title: 'Offshore Observations 💀',
						qty: '1-2',
						dsid: `oracle_rollable:sundered_isles/island/offshore_observations`
					}
				]
			]

		case 'sunderedsettlement':
			return [
				[
					{
						title: 'Settlement size',
						dsid: `oracle_rollable:sundered_isles/settlement/size/${rc}`,
						fl: true
					},
					{
						title: 'Aesthetics',
						dsid: `oracle_rollable:sundered_isles/settlement/aesthetics`,
						fl: true,
						qty: '1-2'
					},
					{
						title: 'First look',
						dsid: `oracle_rollable:sundered_isles/settlement/first_look`,
						fl: true,
						qty: '1-2'
					}
				],
				[
					{
						title: 'Controlling faction',
						dsid: `oracle_rollable:sundered_isles/settlement/identity/controlling_faction/${rc}`
					},
					{
						title: 'Disposition',
						dsid: `oracle_rollable:sundered_isles/settlement/identity/disposition`
					},
					{
						title: 'Authority',
						dsid: `oracle_rollable:sundered_isles/settlement/identity/authority`
					}
				],
				[
					{
						title: 'Settlement focus',
						dsid: `oracle_rollable:sundered_isles/settlement/focus/${kc}`,
						qty: '1-2'
					},
					{
						title: 'Settlement details',
						dsid: `oracle_rollable:sundered_isles/settlement/details`,
						qty: '1-2'
					}
				]
			]

		default:
			return []
	}
})

const firstLookWillRandomizeKlass = computed(() => {
	return !props.data.actor.system.klass
})

const canRandomizeName = computed(() => {
	const { subtype, klass } = props.data.actor.system

	if (subtype === 'planet') {
		const kc = klass ?? ''
		const dskey = `oracle_rollable:starforged/planet/${kc}/name`
		const obj = IdParser.get(dskey)
		if (obj) return true
	} else if (['island', 'settlement', 'sunderedsettlement'].includes(subtype)) {
		return true
	}
	return false
})

const firstLookWillRandomizeName = computed(() => {
	const { subtype, klass } = props.data.actor.system

	// No klass? We only randomize names for settlements and planets
	if (!klass) return ['settlement', 'planet'].includes(subtype)

	const i18nKey = `ACTOR.Subtype${subtype.capitalize()}`
	const newThingName = game.i18n.format('DOCUMENT.New', {
		type: game.i18n.localize(`IRONSWORN.${i18nKey}`)
	})
	if (props.data.actor.name === newThingName) return canRandomizeName.value

	return false
})

const randomKlassTooltip = computed(() => {
	const { subtype } = props.data.actor.system
	return game.i18n.localize(`IRONSWORN.Random${subtype.capitalize()}Type`)
})

const subtypeSelectText = computed(() => {
	const { subtype } = props.data.actor.system
	return game.i18n.localize(`IRONSWORN.${subtype.capitalize()}Type`)
})

const klassIsNotValid = computed(() => {
	const { klass } = props.data.actor.system
	const selectedOption = klassOptions.value.find((x) => x.value === klass)
	return selectedOption === undefined
})

function saveDescription() {
	$actor?.update({ 'system.description': props.data.actor.system.description })
}

function regionChanged(evt) {
	const sceneId = game.user?.viewedScene
	const scene = game.scenes?.get(sceneId ?? '')
	const newValue = evt.target.value
	scene?.setFlag('foundry-ironsworn', 'region', newValue)
}
function subtypeChanged(evt) {
	saveSubtype(evt.target.value)
}
function klassChanged(evt) {
	saveKlass(evt.target.value)
}

async function saveSubtype(subtype) {
	const img = randomImage(subtype, props.data.actor.system.klass)
	await $actor?.update({ system: { subtype } })

	const scale = {
		planet: 1,
		settlement: 2,
		star: 1,
		derelict: 2,
		vault: 2,
		sunderedsettlement: 1,
		island: 1
	}[subtype]
	await updateAllTokens({
		img, // v11
		'texture.src': img, // v12

		scale, // v11
		'texture.scaleX': scale, // v12
		'texture.scaleY': scale // v12
	})
}
async function saveKlass(klass) {
	const { subtype } = props.data.actor.system
	const img = randomImage(subtype, klass)

	await $actor?.update({ img: img || undefined, system: { klass } })
	await updateAllTokens({
		img, // v11
		'texture.src': img // v12
	})
}

async function drawAndReturnResult(
	table?: OracleTable
): Promise<string | undefined> {
	if (!table) return undefined

	const {
		results: [result]
	} = await table.draw()

	return result?.text
}

async function randomizeName() {
	const { subtype, klass } = props.data.actor.system
	let name
	if (subtype === 'planet') {
		const kc = klass ?? ''
		const table = await OracleTable.getByDsId(
			`oracle_rollable:starforged/planet/${kc}/name`
		)
		name = await drawAndReturnResult(table)
	} else if (subtype === 'settlement') {
		const table = await OracleTable.getByDsId(
			'oracle_rollable:starforged/settlement/name'
		)
		name = await drawAndReturnResult(table)
	} else if (subtype === 'sunderedsettlement') {
		const table = await OracleTable.getByDsId(
			'oracle_rollable:sundered_isles/settlement/name'
		)
		name = await drawAndReturnResult(table)
	}

	if (name) {
		await $actor?.update({ name })
		await updateAllTokens({ name })
	}
}

async function randomizeKlass() {
	let tableKey
	const subtype = props.data.actor.system.subtype
	if (subtype === 'planet') {
		tableKey = 'oracle_rollable:starforged/planet/class'
	} else if (subtype === 'settlement') {
		tableKey = 'oracle_rollable:starforged/settlement/location'
	} else if (subtype === 'star') {
		tableKey = 'oracle_rollable:starforged/space/stellar_object'
	} else if (subtype === 'derelict') {
		tableKey = 'oracle_rollable:starforged/derelict/location'
	} else if (subtype === 'vault') {
		tableKey = 'oracle_rollable:starforged/precursor_vault/location'
	} else if (subtype === 'sunderedsettlement') {
		tableKey = 'oracle_rollable:sundered_isles/settlement/location'
	}

	const table = await OracleTable.getByDsId(tableKey)
	const rawText = await drawAndReturnResult(table)
	if (!rawText) return

	const lctext = rawText.toLowerCase()
	const option = klassOptions.value.find((x) => lctext.match(x.value))
	if (option) {
		await saveKlass(option.value)
	}
}

async function rollFirstLook() {
	if (firstLookWillRandomizeKlass.value) await randomizeKlass()
	if (firstLookWillRandomizeName.value) await randomizeName()
	for (const oracle of flatten(oracles.value)) {
		if (oracle.fl) {
			await rollOracle(oracle)
		}
	}
}

async function rollOracle(oracle: OracleSpec) {
	const table = await OracleTable.getByDsId(oracle.dsid)
	const drawText = await drawAndReturnResult(table)
	if (!drawText) {
		return
	}

	// Append to description
	const parts = [
		props.data.actor.system.description,
		'<p><strong>',
		oracle.title,
		':</strong> ',
		drawText,
		'</p>'
	]
	await $actor?.update({ system: { description: parts.join('') } })
}

function nameChange() {
	updateAllTokens({ name: props.data.actor.name })
}

async function updateAllTokens(data) {
	// Prototype token
	// @ts-expect-error - missing field in types
	await $actor?.prototypeToken?.update(data)

	// All tokens in the scene
	const activeTokens = $actor?.getActiveTokens()
	const updates =
		activeTokens?.map((at) => ({
			_id: at.id,
			...data
		})) ?? []
	await canvas?.scene?.updateEmbeddedDocuments('Token', updates)
}
</script>
<style lang="scss">
.sf-location-header {
	display: grid;
	grid-template-columns: max-content 1fr max-content;
	grid-auto-flow: column;

	> * {
		grid-row: 1;
	}

	.charname {
		grid-column: 2 / span 2;
	}

	.btn-randomize-name {
		grid-column: 3;
		border-radius: 0 var(--ironsworn-border-radius-md)
			var(--ironsworn-border-radius-md) 0;
		height: 50px;
		aspect-ratio: 1;
	}
}
</style>

<style lang="scss" scoped>
@use 'mixin:clickable.scss';

label {
	line-height: 27px;

	.select-label {
		flex-basis: 130px;
		flex-grow: 0;
	}
}

.box button {
	padding: var(--ironsworn-spacer-lg);
}

.highlighted {
	@include clickable.blockHover;
}
</style>
