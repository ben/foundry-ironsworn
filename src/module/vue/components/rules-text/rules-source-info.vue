<template>
  <span class="rules-source-info" aria-label="Source">
    <cite v-if="props.source.Url"
      ><a :href="props.source.Url" target="_blank">{{
        props.source.Title
      }}</a></cite
    >
    <cite v-else>{{ source.Title }}</cite
    >{{ pageText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { ISource } from 'dataforged'

const props = defineProps<{ source: ISource }>()

const pageText = computed(() => {
  if (!props.source.Page) {
    return ''
  }
  return (
    ', ' +
    game.i18n.format('IRONSWORN.PageReference', { page: props.source.Page })
  )
})
</script>
