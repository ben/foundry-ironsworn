<template>
	<div class="flexcol" :class="$style.sheet">
		<!-- HEADER -->
		<SheetHeaderBasic class="nogrow" :document="data.actor" />
		<div class="flexrow nogrow" :class="$style.main">
			<div class="flexcol" :class="$style.leftCol">
				<!-- RANK -->
				<article :class="$style.progress">
					<div class="flexrow nogrow" :class="$style.progressTopRow">
						<RankPips
							:id="`${data.actor._id}_rank`"
							:current="data.actor.system.rank"
							class="nogrow"
							@change="setRank" />
						<label :for="`${data.actor._id}_rank`" :class="$style.rankLabel">{{
							localizeRank(data.actor.system.rank)
						}}</label>
						<IronBtn
							v-if="editMode"
							block
							nogrow
							icon="fa:trash"
							@click="clearProgress" />
						<IronBtn block nogrow icon="fa:caret-right" @click="markProgress" />
					</div>
					<!-- PROGRESS -->
					<ProgressTrack
						class="nogrow"
						:ticks="data.actor.system.current"
						:rank="data.actor.system.rank" />
				</article>
				<!-- THEME/DOMAIN -->
				<div class="boxgroup flexcol nogrow">
					<div class="flexrow boxrow nogrow">
						<SiteDroparea
							class="box"
							:item="theme"
							:item-types="['delve-theme']"
							compendium-key="ironsworndelvethemes"
							title-key="IRONSWORN.ITEM.TypeDelveTheme" />
					</div>
					<div class="flexrow boxrow nogrow">
						<SiteDroparea
							class="box"
							:item="domain"
							:item-types="['delve-domain']"
							compendium-key="ironsworndelvedomains"
							title-key="IRONSWORN.ITEM.TypeDelveDomain" />
					</div>
				</div>
				<!-- DENIZENS -->
				<article :class="$style.matrix">
					<h2 class="flexrow nogrow" :class="$style.heading">
						<span>{{ $t('IRONSWORN.DELVESITE.Denizens') }}</span>
						<IronBtn
							nogrow
							style="padding: var(--ironsworn-spacer-xs)"
							icon="ironsworn:d10-tilt"
							@click="randomDenizen" />
						<BtnCompendium compendium="ironswornfoes" nogrow />
					</h2>
					<div class="boxgroup nogrow">
						<div class="flexrow boxrow">
							<SiteDenizenbox :ref="(e) => (denizenRefs[0] = e)" :idx="0" />
							<SiteDenizenbox :ref="(e) => (denizenRefs[1] = e)" :idx="1" />
						</div>
						<div class="flexrow boxrow">
							<SiteDenizenbox :ref="(e) => (denizenRefs[2] = e)" :idx="2" />
							<SiteDenizenbox :ref="(e) => (denizenRefs[3] = e)" :idx="3" />
						</div>
						<div class="flexrow boxrow">
							<SiteDenizenbox :ref="(e) => (denizenRefs[4] = e)" :idx="4" />
							<SiteDenizenbox :ref="(e) => (denizenRefs[5] = e)" :idx="5" />
						</div>
						<div class="flexrow boxrow">
							<SiteDenizenbox :ref="(e) => (denizenRefs[6] = e)" :idx="6" />
							<SiteDenizenbox :ref="(e) => (denizenRefs[7] = e)" :idx="7" />
						</div>
						<div class="flexrow boxrow">
							<SiteDenizenbox :ref="(e) => (denizenRefs[8] = e)" :idx="8" />
							<SiteDenizenbox :ref="(e) => (denizenRefs[9] = e)" :idx="9" />
						</div>
						<div class="flexrow boxrow">
							<SiteDenizenbox :ref="(e) => (denizenRefs[10] = e)" :idx="10" />
							<SiteDenizenbox :ref="(e) => (denizenRefs[11] = e)" :idx="11" />
						</div>
					</div>
				</article>
			</div>
			<div class="scrollable flexcol" :class="$style.rightCol">
				<SiteMoves class="nogrow" />
			</div>
		</div>
		<div class="flexcol">
			<div class="flexrow nogrow">
				<h2 :class="$style.heading">{{ $t('Notes') }}</h2>
				<IronBtn
					block
					nogrow
					class="box"
					:disabled="!hasThemeAndDomain"
					:class="{ [$style.featureBtn]: true }"
					icon="ironsworn:d10-tilt"
					:text="$t('IRONSWORN.DELVESITE.Feature')"
					@click="randomFeature" />
			</div>
			<MceEditor
				v-model="data.actor.system.description"
				@save="saveDescription" />
		</div>
	</div>
</template>

<script setup lang="ts">
import SheetHeaderBasic from './sheet-header-basic.vue'
import { provide, computed, inject, nextTick, ref } from 'vue'
import { $ActorKey, ActorKey } from './provisions'
import RankPips from './components/progress/rank-pips.vue'
import BtnCompendium from './components/buttons/btn-compendium.vue'
import SiteDroparea from './components/site/site-droparea.vue'
import SiteDenizenbox from './components/site/site-denizenbox.vue'
import MceEditor from './components/mce-editor.vue'
import { RANK_INCREMENTS } from '../constants'
import ProgressTrack from './components/progress/progress-track.vue'
import SiteMoves from './components/site/site-moves.vue'
import { OracleRollMessage } from '../rolls'
import type { DelveThemeDataSourceData } from '../item/itemtypes'
import IronBtn from './components/buttons/iron-btn.vue'
import type { SiteDataPropertiesData } from '../actor/actortypes'
import { localizeRank } from '../helpers/util'

const props = defineProps<{
	data: { actor: any }
}>()

provide(ActorKey, computed(() => props.data.actor) as any)
provide('toolset', 'ironsworn')

const $actor = inject($ActorKey)

const editMode = computed(() => {
	return (props.data.actor.flags['foundry-ironsworn'] as any)?.['edit-mode']
})

const theme = computed(() => {
	return props.data.actor.items.find((x) => x.type === 'delve-theme')
})

const domain = computed(() => {
	return props.data.actor.items.find((x) => x.type === 'delve-domain')
})

function setRank(rank) {
	$actor?.update({ system: { rank } })
}

function clearProgress() {
	$actor?.update({ 'system.current': 0 })
}

function markProgress() {
	const increment = RANK_INCREMENTS[props.data.actor.system.rank]
	const newValue = Math.min(props.data.actor.system.current + increment, 40)
	$actor?.update({ 'system.current': newValue })
}

const denizenRefs = ref<{ [k: number]: any }>({})
async function randomDenizen() {
	const denizens = (props.data.actor.system as SiteDataPropertiesData).denizens
	const rows = denizens.map((x) => ({
		low: x.range[0],
		high: x.range[1],
		text: x.text ?? '',
		selected: false
	}))
	const orm = OracleRollMessage.fromRows(
		rows,
		game.i18n.localize('IRONSWORN.DELVESITE.Denizen'),
		props.data.actor.name
	)
	await orm.createOrUpdate()

	// If denizen slot is empty, set focus and add a class
	const result = await orm.getResult()
	if (!result) return
	const idx = denizens.findIndex(
		(x) => x.range[0] <= result.low && x.range[1] >= result.high
	)
	const denizen = denizens[idx]
	if (!denizen?.text) {
		await $actor?.setFlag('foundry-ironsworn', 'edit-mode', true)
		await nextTick()
		denizenRefs.value[idx]?.focus?.()
	}
}

const hasThemeAndDomain = computed(() => {
	return !!(theme.value && domain.value)
})

async function randomFeature() {
	if (!hasThemeAndDomain.value) return

	const themeData = (theme.value as any)?.system as DelveThemeDataSourceData
	const domainData = (domain.value as any)?.system as DelveThemeDataSourceData
	const title = game.i18n.localize('IRONSWORN.DELVESITE.Feature')
	const subtitle = `${$actor?.name} – ${theme.value?.name} ${domain.value?.name}`
	const orm = OracleRollMessage.fromTableResults(
		[...themeData.features, ...domainData.features],
		title,
		subtitle
	)
	orm.createOrUpdate()
}

function saveDescription() {
	$actor?.update({ 'system.description': props.data.actor.system.description })
}
</script>

<style lang="scss" module>
.sheet {
	gap: 0.5em;
}

.progressTopRow {
	gap: var(--ironsworn-spacer-lg);
}

.rankLabel {
	display: flex;
	flex-direction: row nowrap;
	align-items: center;
	margin: 0;
	text-transform: uppercase;
	line-height: 22px;
	font-size: var(--font-size-14);
}

.matrix {
	// TODO: extract this as its own component
}

.main {
	gap: inherit;
}

.siteMoves {
	height: max-content;
}

.rightCol {
	flex-basis: 12em;
	max-height: 411px;
}

.leftCol {
	flex-basis: 20em;
	gap: 1em;
}

.heading {
	display: flex;
	align-items: center;
	margin: 0;
	text-transform: uppercase;
	line-height: 1.5;
	font-size: var(--font-size-14);
	font-weight: bold;
}

.featureBtn {
	text-transform: uppercase;
}
</style>

<style lang="scss" scoped>
textarea {
	border-radius: var(--ironsworn-border-radius-sm);
	resize: none;
}
</style>
