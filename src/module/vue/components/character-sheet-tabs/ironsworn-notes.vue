<template>
	<MceEditor v-model="actor.system.biography" @save="immediateSave" />
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import { inject } from 'vue'
import { $ActorKey, ActorKey } from '../../provisions'
import MceEditor from '../mce-editor.vue'

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const immediateSave = () => {
	$actor?.update({ 'system.biography': actor.value.system.biography })
}
</script>
