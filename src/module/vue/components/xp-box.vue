<template>
	<div :class="classes" data-resource="xp" @click="$emit('click')">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ value: number; current: number }>()

const classes = computed(() => {
	return {
		clickable: true,
		block: true,
		'xp-box': true,
		selected: selected.value
	}
})
const selected = computed(() => {
	return props.value <= props.current
})

defineEmits(['click'])
</script>
