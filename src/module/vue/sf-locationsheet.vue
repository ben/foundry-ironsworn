<template>
	<SheetBasic :document="data.actor">
		<template #before-header>
			<div class="flexrow nogrow" style="gap: var(--ironsworn-spacer-md)">
				<!-- Region -->
				<label
					class="flexrow"
					style="flex-basis: 150px; gap: var(--ironsworn-spacer-xl)">
					<span class="select-label">{{ $t('IRONSWORN.Region') }}</span>
					<select v-model="region" @change="regionChanged">
						<option value="terminus">
							{{ $t('IRONSWORN.REGION.Terminus') }}
						</option>
						<option value="outlands">
							{{ $t('IRONSWORN.REGION.Outlands') }}
						</option>
						<option value="expanse">
							{{ $t('IRONSWORN.REGION.Expanse') }}
						</option>
					</select>
				</label>

				<!-- Subtype -->
				<label
					class="flexrow"
					style="flex-basis: 200px; gap: var(--ironsworn-spacer-xl)">
					{{ $t('IRONSWORN.LocationType') }}
					<select v-model="data.actor.system.subtype" @change="subtypeChanged">
						<option value="planet">Planet</option>
						<option value="settlement">Settlement</option>
						<option value="star">Stellar Object</option>
						<option value="derelict">Derelict</option>
						<option value="vault">Precursor Vault</option>
					</select>
				</label>
			</div>

			<!-- Klass -->
			<label
				class="flexrow nogrow"
				style="position: relative; gap: var(--ironsworn-spacer-xl)">
				<!-- TODO: i18n and subtype text -->
				<span class="select-label">{{ subtypeSelectText }}:</span>
				<select
					v-model="data.actor.system.klass"
					:class="{
						highlighted: state.firstLookHighlight && firstLookWillRandomizeKlass
					}"
					@change="klassChanged">
					<option
						v-for="opt in klassOptions"
						:key="opt.value"
						:value="opt.value">
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
					@click="randomizeKlass" />
			</label>
		</template>
		<template #header>
			<SheetHeaderBasic
				:document="data.actor"
				class="sf-location-header nogrow"
				:name-class="{
					highlighted: state.firstLookHighlight && firstLookWillRandomizeName
				}"
				@change="nameChange">
				<IronBtn
					v-if="canRandomizeName"
					class="btn-randomize-name"
					block
					nogrow
					:tooltip="$t('IRONSWORN.RandomName')"
					icon="ironsworn:d10-tilt"
					@click="randomizeName" />
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
						@mouseleave="state.firstLookHighlight = false" />
				</div>
			</div>
			<div v-for="(row, i) of oracles" :key="`row${i}`" class="flexrow boxrow">
				<div v-for="(oracle, x) of row" :key="`oracle${x}`" class="box flexrow">
					<IronBtn
						:key="oracle.dfid"
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
						@click="rollOracle(oracle)">
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
				@save="saveDescription" />
		</section>
	</SheetBasic>
</template>

<script setup lang="ts">
import SheetHeaderBasic from './sheet-header-basic.vue'
import { capitalize, flatten, sample } from 'lodash-es'
import { provide, computed, reactive, inject, onMounted } from 'vue'
import { $ActorKey, ActorKey } from './provisions'

import MceEditor from './components/mce-editor.vue'
import type {
	ActorDataSource,
	LocationDataProperties
} from '../actor/actortypes'
import SheetBasic from './sheet-basic.vue'
import IronBtn from './components/buttons/iron-btn.vue'
import type { OracleTable } from '../roll-table/oracle-table'
import { Oracles } from '../roll-table/oracles'
import type { IronswornActor } from '../actor/actor'

const props = defineProps<{
	data: {
		actor: ReturnType<IronswornActor['toObject']> &
			Extract<ActorDataSource, { type: 'location' }>
	}
}>()

provide(
	ActorKey,
	computed(() => props.data.actor)
)
const $actor = inject($ActorKey)

const sceneId = game.user?.viewedScene
const scene = game.scenes?.get(sceneId ?? '')
const region =
	(scene?.getFlag('foundry-ironsworn', 'region') as string) || 'terminus'
const state = reactive({
	region,
	firstLookHighlight: false
})

onMounted(async () => {})

function randomImage(subtype, klass): string | void {
	if (subtype === 'planet') {
		const name = capitalize(klass)
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

		default:
			throw new Error('bad type yo')
	}
})

interface OracleSpec {
	title: string
	dfid: string
	qty?: string
	fl?: boolean
	requiresKlass?: boolean
}
const oracles = computed((): OracleSpec[][] => {
	const { subtype, klass } = props.data.actor.system
	const kc = klass
		.split(' ')
		.map((x) => capitalize(x))
		.join(' ')
	const rc = capitalize(state.region)
	switch (subtype) {
		case 'planet':
			return [
				[
					{
						title: 'Atmosphere',
						dfid: `Starforged/Oracles/Planets/${kc}/Atmosphere`,
						fl: true,
						requiresKlass: true
					},
					{
						title: 'Observed from space',
						qty: '1-2',
						dfid: `Starforged/Oracles/Planets/${kc}/Observed_From_Space`,
						fl: true,
						requiresKlass: true
					}
				],
				[
					{
						title: 'Settlements',
						dfid: `Starforged/Oracles/Planets/${kc}/Settlements/${rc}`,
						fl: true,
						requiresKlass: true
					},
					{
						title: 'Life',
						dfid: `Starforged/Oracles/Planets/${kc}/Life`,
						requiresKlass: true
					},
					{
						title: 'Planetside feature',
						qty: '1-2',
						dfid: `Starforged/Oracles/Planets/${kc}/Feature`,
						requiresKlass: true
					}
				],
				[
					{
						title: 'Peril (life)',
						dfid: `Starforged/Oracles/Planets/Peril/Lifebearing`
					},
					{
						title: 'Opportunity (life)',
						dfid: `Starforged/Oracles/Planets/Opportunity/Lifebearing`
					}
				],
				[
					{
						title: 'Peril (lifeless)',
						dfid: `Starforged/Oracles/Planets/Peril/Lifeless`
					},
					{
						title: 'Opportunity (lifeless)',
						dfid: `Starforged/Oracles/Planets/Opportunity/Lifeless`
					}
				]
			]

		case 'settlement':
			return [
				[
					{
						title: 'Population',
						dfid: `Starforged/Oracles/Settlements/Population/${rc}`,
						fl: true
					},
					{
						title: 'First look',
						dfid: 'Starforged/Oracles/Settlements/First_Look',
						qty: '1-2',
						fl: true
					}
				],
				[
					{
						title: 'Initial contact',
						dfid: 'Starforged/Oracles/Settlements/Initial_Contact'
					},
					{
						title: 'Authority',
						dfid: 'Starforged/Oracles/Settlements/Authority'
					}
				],
				[
					{
						title: 'Settlement projects',
						dfid: 'Starforged/Oracles/Settlements/Projects'
					},
					{
						title: 'Settlement trouble',
						dfid: 'Starforged/Oracles/Settlements/Trouble'
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
						dfid: `Starforged/Oracles/Derelicts/Type/${kc}`,
						fl: true,
						requiresKlass: true
					},
					{
						title: 'Condition',
						dfid: `Starforged/Oracles/Derelicts/Condition`,
						fl: true
					}
				],
				[
					{
						title: 'Outer first look',
						dfid: `Starforged/Oracles/Derelicts/Outer_First_Look`,
						fl: true
					},
					{
						title: 'Inner first look',
						dfid: `Starforged/Oracles/Derelicts/Inner_First_Look`
					}
				]
			]

		case 'vault':
			return [
				[
					{
						title: 'Scale',
						dfid: `Starforged/Oracles/Vaults/Scale`,
						fl: true
					},
					{
						title: 'Form',
						dfid: `Starforged/Oracles/Vaults/Form`,
						fl: true
					},
					{
						title: 'Shape',
						dfid: `Starforged/Oracles/Vaults/Shape`,
						fl: true
					}
				],
				[
					{
						title: 'Material',
						dfid: `Starforged/Oracles/Vaults/Material`,
						fl: true
					},
					{
						title: 'Outer first look',
						dfid: `Starforged/Oracles/Vaults/Outer_First_Look`,
						fl: true
					}
				],
				[
					{
						title: 'Interior first look',
						dfid: `Starforged/Oracles/Vaults/Interior/First_Look`
					},
					{
						title: 'Interior feature',
						dfid: `Starforged/Oracles/Vaults/Interior/Feature`
					},
					{
						title: 'Interior peril',
						dfid: `Starforged/Oracles/Vaults/Interior/Peril`
					},
					{
						title: 'Interior opportunity',
						dfid: `Starforged/Oracles/Vaults/Interior/Opportunity`
					}
				],
				[
					{
						title: 'Sanctum purpose',
						dfid: `Starforged/Oracles/Vaults/Sanctum/Purpose`
					},
					{
						title: 'Sanctum feature',
						dfid: `Starforged/Oracles/Vaults/Sanctum/Feature`
					},
					{
						title: 'Sanctum peril',
						dfid: `Starforged/Oracles/Vaults/Sanctum/Peril`
					},
					{
						title: 'Sanctum opportunity',
						dfid: `Starforged/Oracles/Vaults/Sanctum/Opportunity`
					}
				]
			]

		default:
			throw new Error('bad type yo')
	}
})

const firstLookWillRandomizeKlass = computed(() => {
	return !props.data.actor.system.klass
})

const canRandomizeName = computed(() => {
	const { subtype, klass } = props.data.actor.system

	if (subtype === 'planet') {
		const kc = capitalize(klass)
		const json = Oracles.findSync(`Starforged/Oracles/Planets/${kc}`)
		if (json != null) return true
	} else if (subtype === 'settlement') {
		return true
	}
	return false
})

const firstLookWillRandomizeName = computed(() => {
	const { subtype, klass } = props.data.actor.system

	// No klass? We only randomize names for settlements and planets
	if (!klass) return ['settlement', 'planet'].includes(subtype)

	const i18nKey = `ACTOR.Subtype${capitalize(subtype)}`
	const newThingName = game.i18n.format('DOCUMENT.New', {
		type: game.i18n.localize(`IRONSWORN.${i18nKey}`)
	})
	if (props.data.actor.name === newThingName) return canRandomizeName

	return false
})

const randomKlassTooltip = computed(() => {
	const { subtype } = props.data.actor.system
	return game.i18n.localize(`IRONSWORN.Random${capitalize(subtype)}Type`)
})

const subtypeSelectText = computed(() => {
	const { subtype } = props.data.actor.system
	return game.i18n.localize(`IRONSWORN.${capitalize(subtype)}Type`)
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
		vault: 2
	}[subtype]
	await updateAllTokens({ img, scale })
}
async function saveKlass(klass) {
	const { subtype } = props.data.actor.system
	const img = randomImage(subtype, klass)

	await $actor?.update({ img: img || undefined, system: { klass } })
	await updateAllTokens({ img })
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
		const kc = capitalize(klass)
		const json = await Oracles.find(`Starforged/Oracles/Planets/${kc}`)
		name = sample(json?.flags?.['foundry-ironsworn']?.['Sample Names'] ?? [])
	} else if (subtype === 'settlement') {
		const table = await Oracles.find('Starforged/Oracles/Settlements/Name')
		name = await drawAndReturnResult(table)
	}

	if (name) {
		await $actor?.update({ name })
		await updateAllTokens({ name })
	}
}

async function randomizeKlass() {
	let tableKey
	if (props.data.actor.system.subtype === 'planet') {
		tableKey = 'Starforged/Oracles/Planets/Class'
	} else if (props.data.actor.system.subtype === 'settlement') {
		tableKey = 'Starforged/Oracles/Settlements/Location'
	} else if (props.data.actor.system.subtype === 'star') {
		tableKey = 'Starforged/Oracles/Space/Stellar_Object'
	} else if (props.data.actor.system.subtype === 'derelict') {
		tableKey = 'Starforged/Oracles/Derelicts/Location'
	} else if (props.data.actor.system.subtype === 'vault') {
		tableKey = 'Starforged/Oracles/Vaults/Location'
	}

	const table = await Oracles.find(tableKey)
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

async function rollOracle(oracle) {
	const table = await Oracles.find(oracle.dfid)
	const drawText = await drawAndReturnResult(table)
	if (!drawText) return

	// Append to description
	const actor = props.data.actor as LocationDataProperties
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
	await $actor?.data.token.update(data)

	// All tokens in the scene
	const activeTokens = $actor?.getActiveTokens()
	const updates =
		activeTokens?.map((at) => ({
			_id: at.data._id,
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
