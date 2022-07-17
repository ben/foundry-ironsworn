<template>
  <div class="flexcol">
    <h1>TODO</h1>
    <!-- <quill-editor v-model="actor.data.notes" /> -->
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash'
import { inject, Ref } from 'vue'
import { $ActorKey } from '../../provisions'

const actor = inject('actor') as Ref
const $actor = inject($ActorKey)
</script>
