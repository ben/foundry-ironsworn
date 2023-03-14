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
