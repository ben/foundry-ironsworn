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
					<SfAssets :class="$style.assets" />
				</TabPanel>
				<TabPanel tab-key="notes" class="flexcol">
					<SfNotes />
				</TabPanel>
			</TabPanels>
		</TabSet>

		<hr class="nogrow" />

		<section class="flexrow nogrow">
			<div style="text-align: center">
				<ImpactCheckbox class="nogrow" name="battered" :global-hint="true" />
			</div>
			<div style="text-align: center">
				<ImpactCheckbox class="nogrow" name="cursed" :global-hint="true" />
			</div>
		</section>
	</SheetBasic>
</template>

<script setup lang="ts">
import { provide, computed } from 'vue'
import type { IronswornActor } from '../actor/actor'
import SfAssets from './components/character-sheet-tabs/sf-assets.vue'
import SfNotes from './components/character-sheet-tabs/sf-notes.vue'
import ImpactCheckbox from 'component:impact/impact-checkbox.vue'
import SheetBasic from './sheet-basic.vue'
import { ActorKey } from './provisions.js'
import TabSet from './components/tabs/tab-set.vue'
import TabList from './components/tabs/tab-list.vue'
import Tab from './components/tabs/tab.vue'
import TabPanels from './components/tabs/tab-panels.vue'
import TabPanel from './components/tabs/tab-panel.vue'
import IronButton from './components/buttons/iron-btn.vue'

const props = defineProps<{
	data: { actor: ReturnType<typeof IronswornActor.prototype.toObject> }
}>()

provide(ActorKey, computed(() => props.data.actor) as any)
</script>

<style lang="scss" module>
.assets {
	padding-top: var(--ironsworn-spacer-md);
}
</style>
