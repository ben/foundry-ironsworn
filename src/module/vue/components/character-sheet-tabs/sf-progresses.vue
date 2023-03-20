<template>
	<active-completed-progresses
		:excluded-subtypes="['bond']"
		:progress-stars="true" />
</template>

<script setup lang="ts">
import ActiveCompletedProgresses from 'component:progress/active-completed-progresses.vue'
</script>
