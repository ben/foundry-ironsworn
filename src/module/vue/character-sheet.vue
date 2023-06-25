<template>
	<SheetBasic
		:document="data.actor"
		class="character-sheet-classic"
		body-class="flexrow"
		data-tourid="sheet">
		<!-- Header row -->
		<template #header>
			<CharacterHeader />
		</template>

		<!-- Main body row -->
		<!-- Momentum on left -->
		<div class="flexcol margin-left" data-tourid="momentum">
			<MomentumMeterSlider label-position="right" data-tooltip-direction="UP" />
		</div>

		<!-- Center area -->
		<div class="flexcol">
			<!-- Attributes -->
			<div
				class="flexrow stats"
				data-tooltip-direction="UP"
				data-tourid="stats">
				<attr-box attr="edge"></attr-box>
				<attr-box attr="heart"></attr-box>
				<attr-box attr="iron"></attr-box>
				<attr-box attr="shadow"></attr-box>
				<attr-box attr="wits"></attr-box>
			</div>
			<TabSet
				:id="`${data.actor._id}-character-sheet-classic`"
				:tab-keys="['character', 'notes']"
				:class="$style.tabSet"
				:v-slot:icon="{ size: 'sm' }"
				data-tourid="tabs">
				<TabList>
					<Tab
						tab-key="character"
						:text="$t('IRONSWORN.ACTOR.TypeCharacter')" />
					<Tab tab-key="notes" :text="$t('Notes')" />
				</TabList>
				<TabPanels>
					<TabPanel tab-key="character" class="flexcol">
						<IronswornMain />
					</TabPanel>
					<TabPanel tab-key="notes" class="flexcol">
						<IronswornNotes :class="$style.tabContent" />
					</TabPanel>
				</TabPanels>
			</TabSet>

			<!-- Conditions & Banes & Burdens -->
			<section class="sheet-area nogrow" data-tourid="conditions">
				<conditions />
			</section>
		</div>

		<!-- Stats on right -->
		<PcConditionMeters
			class="flexcol margin-right"
			data-tooltip-direction="UP"
			label-position="left"
			data-tourid="resources" />
	</SheetBasic>
</template>

<script setup lang="ts">
import { ActorKey } from './provisions'
import AttrBox from './components/attr-box.vue'
import { provide, computed } from 'vue'
import CharacterHeader from './components/character-header.vue'
import Conditions from 'component:impact/debilities-classic.vue'
import SheetBasic from './sheet-basic.vue'
import PcConditionMeters from './components/resource-meter/pc-condition-meters.vue'
import MomentumMeterSlider from './components/resource-meter/momentum-meter.vue'
import TabSet from './components/tabs/tab-set.vue'
import TabList from './components/tabs/tab-list.vue'
import Tab from './components/tabs/tab.vue'
import TabPanels from './components/tabs/tab-panels.vue'
import TabPanel from './components/tabs/tab-panel.vue'
import IronswornMain from './components/character-sheet-tabs/ironsworn-main.vue'
import IronswornNotes from './components/character-sheet-tabs/ironsworn-notes.vue'

const props = defineProps<{
	data: { actor: ActorSource<'character'> }
}>()

provide(
	ActorKey,
	computed(() => props.data.actor)
)
</script>

<style lang="scss" module>
.tabContent {
	height: inherit;
}

.tabSet {
	margin-top: var(--ironsworn-spacer-lg);
}
</style>

<style lang="scss" scoped>
.character-sheet-classic {
	gap: var(--ironsworn-spacer-xl);
}

.stat-roll {
	text-transform: uppercase;
}
</style>
