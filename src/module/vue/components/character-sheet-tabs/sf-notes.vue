<template>
	<div class="flexcol">
		<MceEditor v-model="actor.system.notes" @save="save" />
	</div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { inject } from 'vue'
import { $ActorKey, ActorKey } from '../../provisions'
import MceEditor from '../mce-editor.vue'

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const save = () => {
	$actor?.update({ 'system.notes': actor.value.system.notes })
}
</script>
