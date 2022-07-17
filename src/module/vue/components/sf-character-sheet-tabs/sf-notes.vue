<template>
  <div class="flexcol">
    <MceEditor v-model="actor.data.notes" @change="save" />
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash'
import { inject, Ref } from 'vue'
import { $ActorKey } from '../../provisions'
import MceEditor from '../mce-editor.vue'

const actor = inject('actor') as Ref
const $actor = inject($ActorKey)

const save = debounce(() => {
  $actor?.update({ 'data.notes': actor.value.data.notes })
}, 500)
</script>
