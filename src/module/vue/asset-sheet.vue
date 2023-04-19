<template>
	<div class="flexcol" style="gap: 5px">
		<SheetHeaderBasic class="nogrow" :document="data.item"> </SheetHeaderBasic>
		<TabSet
			v-if="editMode"
			:id="`${data.item._id}-asset-sheet`"
			:tab-keys="['description', 'fields', 'abilities', 'options', 'track']"
			:class="$style.tabSet">
			<TabList :class="$style.tabList">
				<Tab
					tab-key="description"
					:class="$style.tab"
					:text="$t('Description')" />
				<Tab
					tab-key="fields"
					:class="$style.tab"
					:text="$t('IRONSWORN.Fields')" />
				<Tab
					tab-key="abilities"
					:class="$style.tab"
					:text="$t('IRONSWORN.Abilities')" />
				<Tab
					tab-key="options"
					:class="$style.tab"
					:text="$t('IRONSWORN.Options')" />
				<Tab
					tab-key="track"
					:class="$style.tab"
					:text="$t('IRONSWORN.Track')" />
			</TabList>
			<TabPanels :class="$style.tabPanels">
				<TabPanel
					tab-key="description"
					class="flexcol"
					:class="$style.tabPanel">
					<AssetEditDescription />
				</TabPanel>
				<TabPanel tab-key="fields" class="flexcol" :class="$style.tabPanel">
					<AssetEditFields />
				</TabPanel>
				<TabPanel tab-key="abilities" class="flexcol" :class="$style.tabPanel">
					<AssetEditAbilities />
				</TabPanel>
				<TabPanel tab-key="options" class="flexcol" :class="$style.tabPanel">
					<AssetEditOptions />
				</TabPanel>
				<TabPanel tab-key="track" class="flexcol" :class="$style.tabPanel">
					<AssetEditTrack />
				</TabPanel>
			</TabPanels>
		</TabSet>
		<AssetCard
			v-else
			class="flexcol"
			:class="$style.asset"
			:hide-disabled-abilities="false"
			:readonly-clocks="true"
			:toggle-abilities="true"
			:readonly-fields="false">
			<template #title></template>
			<!--
        Semi-edit view:
        * Text entry for field VALUES (not names)
        * Checkboxes for abilities; clocks not settable to avoid click conflicts
        * Selection for exclusive options
        * Track: name and value only
        * Conditions: checkboxes only
       -->
		</AssetCard>
	</div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import SheetHeaderBasic from './sheet-header-basic.vue'
import AssetEditDescription from 'component:asset/asset-edit-description.vue'
import AssetEditFields from 'component:asset/asset-edit-fields.vue'
import AssetEditAbilities from 'component:asset/asset-edit-abilities.vue'
import AssetEditOptions from 'component:asset/asset-edit-options.vue'
import AssetCard from 'component:asset/asset-card.vue'

import AssetEditTrack from 'component:asset/asset-edit-track.vue'
import { ItemKey } from './provisions'
import TabSet from 'component:tabs/tab-set.vue'
import TabList from 'component:tabs/tab-list.vue'
import TabPanels from 'component:tabs/tab-panels.vue'
import TabPanel from 'component:tabs/tab-panel.vue'
import Tab from 'component:tabs/tab.vue'

const props = defineProps<{ data: { item: any } }>()
provide(ItemKey, computed(() => props.data.item) as any)

const editMode = computed(() => {
	return props.data.item.flags['foundry-ironsworn']?.['edit-mode']
})
</script>

<style lang="scss" module>
.tabList {
}

.tab {
}

.tabPanels {
}

.tabPanel {
}
.asset {
	padding: var(--ironsworn-spacer-md);
}
</style>
