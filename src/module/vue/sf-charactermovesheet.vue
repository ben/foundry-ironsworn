<template>
	<TabSet
		:id="`${(data.actor as any)._id}_move-sheet`"
		ref="$tabSet"
		:class="$style.tabSet"
		:tab-keys="['moves', 'oracles']"
		data-tourid="sheet">
		<TabList>
			<Tab tab-key="moves" :text="$t('IRONSWORN.ITEMS.TypeMove')">
				<template #icon>
					<IronIcon name="d10-tilt" size="1.25em"></IronIcon>
				</template>
			</Tab>
			<Tab tab-key="oracles" :text="$t('IRONSWORN.ROLLTABLES.TypeOracle')">
				<template #icon>
					<IronIcon name="oracle" size="1.25em"></IronIcon>
				</template>
			</Tab>
		</TabList>
		<TabPanels>
			<TabPanel tab-key="moves" class="flexcol">
				<Suspense>
					<SfMovesheetmoves
						ref="movesTab"
						:class="$style.panelContent"
						:toolset="data.toolset" />
				</Suspense>
			</TabPanel>
			<TabPanel tab-key="oracles" class="flexcol">
				<Suspense>
					<SfMovesheetoracles
						ref="oraclesTab"
						:class="$style.panelContent"
						:toolset="data.toolset" />
				</Suspense>
			</TabPanel>
		</TabPanels>
	</TabSet>
</template>

<script lang="ts" setup>
import SfMovesheetmoves from './components/sf-movesheetmoves.vue'
import SfMovesheetoracles from './components/sf-movesheetoracles.vue'
import { computed, provide, ref } from 'vue'
import type { CharacterData } from '../actor/config'
import { ActorKey } from './provisions.js'
import TabSet from './components/tabs/tab-set.vue'
import TabList from './components/tabs/tab-list.vue'
import Tab from './components/tabs/tab.vue'
import TabPanels from './components/tabs/tab-panels.vue'
import TabPanel from './components/tabs/tab-panel.vue'
import IronIcon from './components/icon/iron-icon.vue'
import type { CharacterDataProperties } from '../actor/subtypes/character'

const props = defineProps<{
	data: {
		actor: CharacterDataProperties
		toolset: 'ironsworn' | 'starforged'
	}
}>()

provide(ActorKey, computed(() => props.data.actor) as any)

const $tabSet = ref<InstanceType<typeof TabSet>>()
const movesTab = ref<InstanceType<typeof SfMovesheetmoves>>()
CONFIG.IRONSWORN.emitter.on('highlightMove', () =>
	$tabSet.value?.setActiveTab('moves')
)

const oraclesTab = ref<InstanceType<typeof SfMovesheetoracles>>()
CONFIG.IRONSWORN.emitter.on('highlightOracle', () =>
	$tabSet.value?.setActiveTab('oracles')
)
</script>

<style lang="scss" module>
.tabSet {
	// TODO make alternate layouts possible, possibly with media query?
}

.panelContent {
	flex-grow: 1;
	// HACK: offsets the padding on window.content with a negative margin, then pads it out. this way, the scrollbar appears in the empty space left by the padding instead of overlapping the content.
	margin: 0 calc(var(--ironsworn-spacer-md) * -1);
	padding: 0 var(--ironsworn-spacer-md);
}
</style>
