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
				type="impact"
				name="battered"
				:global-hint="true"
				:class="$style.impact" />
			<ImpactCheckbox
				type="impact"
				name="cursed"
				:global-hint="true"
				:class="$style.impact" />
		</section>
	</SheetBasic>
</template>

<script setup lang="ts">
import { provide, computed } from 'vue'
import SfNotes from './components/character-sheet-tabs/sf-notes.vue'
import ImpactCheckbox from 'component:impact/impact-checkbox.vue'
import SheetBasic from './sheet-basic.vue'
import { ActorKey } from './provisions.js'
import TabSet from './components/tabs/tab-set.vue'
import TabList from './components/tabs/tab-list.vue'
import Tab from './components/tabs/tab.vue'
import TabPanels from './components/tabs/tab-panels.vue'
import TabPanel from './components/tabs/tab-panel.vue'
import PlayerAssets from './components/asset/player-assets.vue'

const props = defineProps<{
	data: { actor: ActorSource<'starship'> }
}>()

provide(ActorKey, computed(() => props.data.actor) as any)
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
