<template>
	<p>{{ moveItem.system.Text }}</p>
</template>

<script setup lang="ts">
import type { IndexedMove } from '../../features/custommoves'
import { IronswornItem } from '../../item/item'

const props = defineProps<{
	move: IndexedMove
}>()

const moveItem = (await fromUuid(props.move.uuid)) as IronswornItem<'sfmove'>
</script>
