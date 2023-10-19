<template>
	<IronBtn
		class="move-chat"
		:tooltip="$t('IRONSWORN.SendToChat', { move: getMove().name })"
		icon="fa:comment"
		v-bind="($props, $attrs)"
		@click="sendToChat">
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { createSfMoveChatMessage } from '../../../chat/sf-move-chat-message'
import type { Move } from '../../../features/custommoves'
import { IronswornItem } from '../../../item/item'
import { $ItemKey } from '../../provisions.js'
import IronBtn from './iron-btn.vue'

interface Props extends Omit<PropsOf<typeof IronBtn>, 'tooltip'> {
	getMove: () => IronswornItem<'sfmove'>
}

defineProps<Props>()

const $item = inject($ItemKey)

function sendToChat(e) {
	if ($item) createSfMoveChatMessage($item)
}
</script>
