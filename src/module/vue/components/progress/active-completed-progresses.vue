<template>
	<article class="flexcol">
		<DropTarget
			:is="ProgressList"
			drop-type="progress"
			:compact-progress="compactProgress"
			:excluded-subtypes="excludedSubtypes"
			:progress-stars="progressStars"
			:show-completed="'no-completed'"
		/>
		<ProgressControls class="nogrow" />
		<CompletedProgressList
			class="nogrow"
			:collapsible-props="{ toggleWrapperIs: 'h3' }"
		/>
	</article>
</template>

<script setup lang="ts">
import ProgressControls from 'component:progress/progress-controls.vue'
import ProgressList from 'component:progress/progress-list.vue'
import DropTarget from '../../drop-target.vue'
import CompletedProgressList from 'component:progress/completed-progress-list.vue'

defineProps<{
	/**
	 * List of progress subtypes to exclude from the list. To leave out
	 * connections, pass `['bond']` here.
	 */
	excludedSubtypes?: string[]
	progressStars?: boolean
	/**
	 * When true, renders the progress bars for more compact display.
	 */
	compactProgress?: boolean
}>()
</script>
