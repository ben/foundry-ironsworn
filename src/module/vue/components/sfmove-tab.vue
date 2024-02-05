<template>
	<div
		:class="[
			'clickable',
			'block',
			'nogrow',
			'tab',
			'flexrow',
			{ selected: currentProperty === property }
		]"
		@click="$emit('click', property)">
		<span>{{ title || $t('IRONSWORN.' + titleKey) }}</span>
		<IronBtn
			v-if="$attrs.onDelete"
			nogrow
			block
			icon="fa:trash"
			@click="$emit('delete')" />
	</div>
</template>

<script setup lang="ts">
import IronBtn from './buttons/iron-btn.vue'

const props = defineProps<{
	title?: string
	titleKey?: string
	property: string
	currentProperty: string
}>()

defineEmits<{ click: [string] }>()
</script>

<style lang="scss" scoped>
span {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
