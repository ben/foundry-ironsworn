<template>
  <div class="flexcol">
    <h1>{{ je().name }}</h1>

    <TruthSelectable
      v-for="page in truthPages"
      :page="page"
      :radio-group="df.$id"
      @select="select"
    />

    <!-- TODO: custom entry -->

    <div
      class="nogrow"
      v-for="page in nonTruthPages"
      v-html="page.text.content"
    />
  </div>
</template>

<script lang="ts" setup>
import { ISettingTruth } from 'dataforged'
import TruthSelectable from './truth-selectable.vue'

const props = defineProps<{
  df: ISettingTruth
  je: () => JournalEntry
}>()

const truthPages = (props.je()?.pages ?? []).filter((p) => p.type === 'truth')
const nonTruthPages = (props.je()?.pages ?? []).filter(
  (p) => p.type !== 'truth'
)

const $emit = defineEmits<{
  (e: 'select', df: ISettingTruth, title: string, value: string)
}>()

function select(categoryid: string, title: string, text: string) {
  console.log({ categoryid, title, text })
}
</script>
