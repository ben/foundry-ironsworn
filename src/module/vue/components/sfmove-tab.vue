<template>
	<div
		@click="$emit('click', property)"
		:class="[
			'clickable',
			'block',
			'nogrow',
			'tab',
			'flexrow',
			{ selected: currentProperty === property }
		]">
		<span>{{ title || $t('IRONSWORN.' + titleKey) }}</span>
		<IronBtn
			nogrow
			block
			v-if="$attrs.onDelete"
			icon="fa:trash"
			@click="$emit('delete')" />
	</div>
</template>

<style lang="scss" scoped>
div {
	--ironsworn-move-tab-border-width: var(--ironsworn-border-width-md);

	border-width: var(--ironsworn-move-tab-border-width);
	border-right-width: 0;
	padding: var(--ironsworn-spacer-xs);

	&:not(:first-child) {
		margin-top: calc(var(--ironsworn-move-tab-border-width) * -1);
	}
}

span {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>

<script setup lang="ts">
// FIXME: migrate to new tab components
import IronBtn from './buttons/iron-btn.vue'

defineProps<{
	title?: string
	titleKey?: string
	property: string
	currentProperty: string
}>()

defineEmits<{ (e: 'click', property: string) }>()
</script>
