<template>
	<IronBtn
		class="move-chat"
		:tooltip="$t('IRONSWORN.SendToChat', { move: move.name })"
		icon="fa:comment"
		v-bind="($props, $attrs)"
		@click="sendToChat"
	>
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script setup lang="ts">
import { createSfMoveChatMessage } from '../../../chat/sf-move-chat-message'
import type { IndexedMove } from '../../../features/custommoves'
import IronBtn from './iron-btn.vue'
import { IronswornItem } from '../../../item/item'

interface Props
	extends /* @vue-ignore */ Omit<PropsOf<typeof IronBtn>, 'tooltip'> {
	move: IndexedMove
}

const props = defineProps<Props>()

async function sendToChat() {
	const item = (await fromUuid(props.move.uuid)) as IronswornItem<'sfmove'>
	if (item) createSfMoveChatMessage(item)
}
</script>
