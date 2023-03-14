<template>
	<active-completed-progresses
		:filter-fn="(item: any) => item.system.subtype != 'bond'"
		:progress-stars="true" />
</template>

<script setup lang="ts">
import ActiveCompletedProgresses from '../progress/active-completed-progresses.vue'
</script>
