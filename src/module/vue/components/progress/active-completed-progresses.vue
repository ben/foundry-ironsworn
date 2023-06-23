<template>
	<article class="flexcol">
		<DropTarget
			:is="ProgressList"
			drop-type="progress"
			:compact-progress="compactProgress"
			:excluded-subtypes="excludedSubtypes"
			:progress-stars="progressStars"
			:show-completed="'no-completed'" />
		<ProgressControls class="nogrow" :foe-compendium="foeCompendium" />
		<CompletedProgressList
			class="nogrow"
			:collapsible-props="{ toggleWrapperIs: 'h3' }" />
	</article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProgressControls from 'component:progress/progress-controls.vue'
import { IronswornSettings } from '../../../helpers/settings'
import ProgressList from 'component:progress/progress-list.vue'
import DropTarget from '../../drop-target.vue'
import CompletedProgressList from 'component:progress/completed-progress-list.vue'

defineProps<{
	/**
	 * List of progress subtypes to exclude from the list. To leave out
	 * connections, pass `['connection']` here.
	 */
	excludedSubtypes?: string[]
	progressStars?: boolean
	/**
	 * When true, renders the progress bars for more compact display.
	 */
	compactProgress?: boolean
}>()

const foeCompendium = computed(() => {
	return IronswornSettings.starforgedToolsEnabled
		? 'starforgedencounters'
		: 'ironswornfoes'
})
</script>
