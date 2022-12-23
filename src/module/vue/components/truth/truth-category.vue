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
import { reactive } from 'vue'
import TruthSelectable from './truth-selectable.vue'

const props = defineProps<{
  df: ISettingTruth
  je: () => JournalEntry
}>()

const truthPages = (props.je()?.pages ?? []).filter((p) => p.type === 'truth')
const nonTruthPages = (props.je()?.pages ?? []).filter(
  (p) => p.type !== 'truth'
)

type State = {
  title?: string
  text?: string
}

const state = reactive<State>({})
function select(title: string, text: string) {
  state.title = title
  state.text = text
}

defineExpose({ selectedValue })
function selectedValue(): State {
  return state
}
</script>
