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
					class="boxgroup box"
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
								<BtnCompendium compendium="ironswornfoes" nogrow />
								<IronBtn
									nogrow
									style="padding: var(--ironsworn-spacer-xs)"
									icon="ironsworn:d10-tilt"
									@click="randomDenizen"
								/>
							</h2>
							<div class="nogrow">
								<SiteDenizenbox :ref="(e) => (denizenRefs[0] = e)" :idx="0" />
								<SiteDenizenbox :ref="(e) => (denizenRefs[1] = e)" :idx="1" />
								<SiteDenizenbox :ref="(e) => (denizenRefs[2] = e)" :idx="2" />
								<SiteDenizenbox :ref="(e) => (denizenRefs[3] = e)" :idx="3" />
								<SiteDenizenbox :ref="(e) => (denizenRefs[4] = e)" :idx="4" />
								<SiteDenizenbox :ref="(e) => (denizenRefs[5] = e)" :idx="5" />
								<SiteDenizenbox :ref="(e) => (denizenRefs[6] = e)" :idx="6" />
								<SiteDenizenbox :ref="(e) => (denizenRefs[7] = e)" :idx="7" />
								<SiteDenizenbox :ref="(e) => (denizenRefs[8] = e)" :idx="8" />
								<SiteDenizenbox :ref="(e) => (denizenRefs[9] = e)" :idx="9" />
								<SiteDenizenbox :ref="(e) => (denizenRefs[10] = e)" :idx="10" />
								<SiteDenizenbox :ref="(e) => (denizenRefs[11] = e)" :idx="11" />
							</div>
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
import IronBtn from './components/buttons/iron-btn.vue'
import type { IronswornActor } from '../actor/actor'
import { ChallengeRank } from '../fields/ChallengeRank'

import TabSet from 'component:tabs/tab-set.vue'
import TabList from 'component:tabs/tab-list.vue'
import TabPanels from 'component:tabs/tab-panels.vue'
import TabPanel from 'component:tabs/tab-panel.vue'
import Tab from 'component:tabs/tab.vue'

const props = defineProps<{
	data: { actor: ActorSource<'site'> }
}>()

provide(
	ActorKey,
	computed(() => props.data.actor)
)

const $actor = inject($ActorKey) as IronswornActor<'site'>

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

const denizenRefs = ref<{ [k: number]: any }>({})
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
