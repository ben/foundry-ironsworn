<template>
  <div class="flexcol">
    <MceEditor
      v-model="actor.data.biography"
      @change="debouncedSave"
      @save="immediateSave"
    />
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash'
import { inject, Ref } from 'vue'
import { $ActorKey, ActorKey } from '../../provisions'
import MceEditor from '../mce-editor.vue'

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const immediateSave = () => {
  $actor?.update({ 'data.biography': actor.value.data.biography })
}
const debouncedSave = debounce(immediateSave, 1000)
</script>
