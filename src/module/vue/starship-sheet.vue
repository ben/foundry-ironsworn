<template>
	<SheetBasic :document="data.actor" body-class="flexcol">
		<TabSet
			:id="`${data.actor._id}-starship-sheet`"
			:tab-keys="['assets', 'notes']">
			<TabList>
				<Tab tab-key="assets" :text="$t('IRONSWORN.ITEMS.TypeAsset')" />
				<Tab tab-key="notes" :text="$t('Notes')" />
			</TabList>
			<TabPanels>
				<TabPanel tab-key="assets" class="flexcol">
					<PlayerAssets :class="$style.assets" />
				</TabPanel>
				<TabPanel tab-key="notes" class="flexcol">
					<SfNotes />
				</TabPanel>
			</TabPanels>
		</TabSet>

		<hr class="nogrow" />

		<section class="flexrow nogrow" :class="$style.impacts">
			<ImpactCheckbox
				v-for="impact in $actor?.validImpacts"
				:key="impact.id"
				:data="impact"
				:class="$style.impact" />
		</section>
	</SheetBasic>
</template>

<script setup lang="ts">
import { provide, computed, inject } from 'vue'
import SfNotes from './components/character-sheet-tabs/sf-notes.vue'
import SheetBasic from './sheet-basic.vue'
import { $ActorKey, ActorKey } from './provisions.js'
import TabSet from './components/tabs/tab-set.vue'
import TabList from './components/tabs/tab-list.vue'
import Tab from './components/tabs/tab.vue'
import TabPanels from './components/tabs/tab-panels.vue'
import TabPanel from './components/tabs/tab-panel.vue'
import PlayerAssets from './components/asset/player-assets.vue'
import ImpactCheckbox from './components/impact/impact-checkbox.vue'
import type { IronswornActor } from '../actor/actor'

const props = defineProps<{
	data: { actor: ActorSource<'starship'> }
}>()

provide(
	ActorKey,
	computed(() => props.data.actor)
)
const $actor = inject($ActorKey) as IronswornActor<'starship'>
</script>

<style lang="scss" module>
.assets {
	padding-top: var(--ironsworn-spacer-md);
}

.impacts {
	justify-content: center;
	gap: 4ch;
}
.impact {
	max-width: max-content;
}
</style>
