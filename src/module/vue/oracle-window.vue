<template>
	<div class="flexcol">
		<Suspense>
			<SfMovesheetoracles />
		</Suspense>
	</div>
</template>

<script setup lang="ts">
import { IronswornSettings } from '../helpers/settings'
import SfMovesheetoracles from './components/sf-movesheetoracles.vue'
import TabList from './components/tabs/tab-list.vue'
import TabPanel from './components/tabs/tab-panel.vue'
import TabPanels from './components/tabs/tab-panels.vue'
import TabSet from './components/tabs/tab-set.vue'
import Tab from './components/tabs/tab.vue'

const defaultTab = IronswornSettings.defaultToolbox
const enableSunderedIsles = IronswornSettings.get('sundered-isles-beta')
const tabKeys = ['ironsworn', 'starforged']
if (enableSunderedIsles) tabKeys.push('sunderedisles')
</script>
