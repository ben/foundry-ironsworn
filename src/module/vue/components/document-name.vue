<template>
  <component :is="tag || 'h1'" class="charname">
    <input
      :placeholder="$t('IRONSWORN.Name')"
      v-model="document.name"
      name="name"
      type="text"
    />
  </component>
</template>

<script setup lang="ts">
import { IronswornItem } from '../../item/item'
import { inject } from 'vue'
const props = defineProps<{ document: any; tag?: string }>()

const $item = inject('$item') as IronswornItem
const $actor = inject('$actor') as IronswornItem

function save() {
  const document = $item ?? $actor
  document?.update({ name: props.document.name })
}
</script>
