<template>
	<div class="flexcol" :class="$style.sheet">
		<!-- HEADER -->
		<SheetHeaderBasic class="nogrow" :document="data.actor" />
		<div class="flexrow nogrow" :class="$style.main">
			<!-- LEFT COLUMN -->
			<div class="flexcol" :class="$style.leftCol">
				<!-- RANK -->
				<!-- THEME/DOMAIN -->
				<div class="boxgroup flexcol nogrow" :class="$style.themesAndDomains">
					<div class="flexrow boxrow nogrow">
						<!-- THEME -->
						<div class="flexcol box">
							<SiteDroparea
								:item="theme"
								item-type="delve-theme"
								compendium-key="ironsworndelvethemes"
								title-key="IRONSWORN.ITEM.TypeDelveTheme"
							/>
						</div>
						<div class="flexcol box">
							<SiteDroparea
								:item="domain"
								item-type="delve-domain"
								compendium-key="ironsworndelvedomains"
								title-key="IRONSWORN.ITEM.TypeDelveDomain"
							/>
						</div>
						<!-- DOMAIN -->
					</div>
				</div>

				<TabSet
					:class="$style.tabs"
					:id="`${data.actor._id}-features-dangers-denizens`"
					:tab-keys="['features', 'dangers', 'denizens']"
				>
					<TabList>
						<Tab tab-key="features" text="Features" />
						<Tab tab-key="dangers" text="Dangers" />
						<Tab tab-key="denizens" text="Denizens" />
					</TabList>
					<TabPanels>
						<TabPanel tab-key="features"><h2>Features</h2></TabPanel>
						<TabPanel tab-key="dangers"><h2>Dangers</h2></TabPanel>
						<TabPanel tab-key="denizens">
							<h2 class="flexrow nogrow" :class="$style.heading">
								<span></span>
							</h2>
							<table>
								<colgroup>
									<col span="1" style="width: 4em" />
									<col span="1" />
								</colgroup>
								<thead>
									<tr>
										<th>
											<IronBtn
												icon="ironsworn:d10-tilt"
												@click="randomDenizen"
											/>
										</th>
										<th class="flexrow">
											<span style="text-align: left">Denizen</span>
											<IronBtn
												text
												nogrow
												style="margin: 0 0.5em"
												icon="fa:book-atlas"
												@click="openFoeBrowser"
											/>
										</th>
									</tr>
								</thead>

								<tbody>
									<SiteDenizenRow
										v-for="i in range(12)"
										:key="i"
										ref="denizenRefs"
										v-model="denizens[i]"
										:edit-mode="editMode"
									/>
								</tbody>
							</table>
						</TabPanel>
					</TabPanels>
				</TabSet>
			</div>

			<!-- RIGHT COLUMN -->
			<div class="scrollable flexcol" :class="$style.rightCol">
				<article :class="$style.progress" class="nogrow">
					<div class="flexrow nogrow" :class="$style.progressTopRow">
						<RankPips
							:id="`${data.actor._id}_rank`"
							:current="data.actor.system.rank"
							class="nogrow"
							@change="(rank) => $actor.update({ system: { rank } })"
						/>
						<label :for="`${data.actor._id}_rank`" :class="$style.rankLabel">{{
							ChallengeRank.localizeValue(data.actor.system.rank)
						}}</label>
						<IronBtn
							v-if="editMode"
							block
							nogrow
							icon="fa:trash"
							@click="$actor.update({ system: { current: 0 } })"
						/>
						<IronBtn block nogrow icon="fa:caret-right" @click="markProgress" />
					</div>
					<!-- PROGRESS -->
					<ProgressTrack
						class="nogrow"
						:ticks="data.actor.system.current"
						:rank="data.actor.system.rank"
					/>
				</article>
				<Suspense>
					<SiteMoves class="nogrow" />
				</Suspense>
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
					@click="$actor?.system.features?.draw()"
				/>
			</div>
			<MceEditor
				v-model="data.actor.system.description"
				@save="saveDescription"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { provide, computed, inject, nextTick, ref, reactive, watch } from 'vue'
import { range } from 'lodash-es'
import { $ActorKey, ActorKey } from './provisions'
import { RANK_INCREMENTS } from '../constants'
import type { IronswornActor } from '../actor/actor'
import { ChallengeRank } from '../fields/ChallengeRank'
import { FoeBrowser } from '../item/foe-browser'

import SheetHeaderBasic from './sheet-header-basic.vue'
import RankPips from './components/progress/rank-pips.vue'
import SiteDroparea from './components/site/site-droparea.vue'
import SiteDenizenbox from './components/site/site-denizenbox.vue'
import MceEditor from './components/mce-editor.vue'
import ProgressTrack from './components/progress/progress-track.vue'
import SiteMoves from './components/site/site-moves.vue'
import IronBtn from './components/buttons/iron-btn.vue'
import TabSet from 'component:tabs/tab-set.vue'
import TabList from 'component:tabs/tab-list.vue'
import TabPanels from 'component:tabs/tab-panels.vue'
import TabPanel from 'component:tabs/tab-panel.vue'
import Tab from 'component:tabs/tab.vue'
import SiteDenizenRow from 'component:site/site-denizenrow.vue'

const props = defineProps<{
	data: { actor: ActorSource<'site'> }
}>()

provide(
	ActorKey,
	computed(() => props.data.actor)
)

const $actor = inject($ActorKey) as IronswornActor<'site'>

// Local reactive copy of denizen values
const denizens = reactive(new Array(12).fill(''))
$actor.system.denizens.forEach((d, i) => {
	denizens[i] = d
})
watch(
	denizens,
	(newDenizens) => {
		const oldDenizens = foundry.utils.deepClone($actor.system.denizens)
		oldDenizens.forEach((od, i) => {
			const nd = newDenizens[i]
			od.text = nd.text
		})
		$actor.update({ 'system.denizens': oldDenizens })
	},
	{ deep: true }
)

const editMode = computed(() => {
	return props.data.actor.flags['foundry-ironsworn']?.['edit-mode']
})

const theme = computed(() => {
	return props.data.actor.items.find(
		(item) => item.type === 'delve-theme'
	) as ItemSource<'delve-theme'>
})

const domain = computed(() => {
	return props.data.actor.items.find(
		(item) => item.type === 'delve-domain'
	) as ItemSource<'delve-domain'>
})

function markProgress() {
	const increment = RANK_INCREMENTS[props.data.actor.system.rank]
	const newValue = Math.min(props.data.actor.system.current + increment, 40)
	$actor?.update({ 'system.current': newValue })
}

const denizenRefs = ref<any[]>([])
async function randomDenizen() {
	if ($actor?.system.denizens == null) return

	const { roll } = await $actor.system.denizenTable.draw()

	if (!roll || !roll.total) return

	// If denizen slot is empty, set focus and add a class

	const idx = $actor.system.denizenTable.results.contents.findIndex((x) =>
		x.hasInRange(roll.total as number)
	)
	const denizen = $actor.system.denizenTable.results.contents[idx]
	if (!denizen?.text) {
		await $actor?.setFlag('foundry-ironsworn', 'edit-mode', true)
		await nextTick()
		denizenRefs.value[idx]?.focus?.()
	}
}

function openFoeBrowser() {
	new FoeBrowser().render(true)
}

const hasThemeAndDomain = computed(() => {
	return !!(theme.value && domain.value)
})

function saveDescription() {
	$actor?.update({ 'system.description': props.data.actor.system.description })
}
</script>

<style lang="scss" module>
.sheet {
	gap: 0.5em;
}

.progress {
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
	gap: 1em;
	max-height: 30em;
}

.leftCol {
	gap: 1em;
	min-height: 30em;
	margin-left: 0.25rem;
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

.tabs {
	border: var(--ironsworn-border-width-md) solid var(--ironsworn-color-border);
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
