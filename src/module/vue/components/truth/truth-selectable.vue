<template>
  <label class="nogrow flexrow">
    <input
      type="radio"
      class="nogrow"
      @change="select"
      :name="radioGroup"
      ref="topRadio"
    />
    <div class="flexcol">
      <p>
        <strong>{{ page.name }}</strong>
      </p>

      <div v-html="$enrichMarkdown(page.system.Description)" />

      <section v-if="page.system.Subtable">
        <label class="flexrow nogrow" v-for="entry in page.system.Subtable">
          <input
            type="radio"
            class="nogrow"
            @change="subtableSelect(entry)"
            :name="page.system.dfid"
          />
          <p v-html="entry.Result" />
        </label>

        <!-- TODO: custom input -->
      </section>
    </div>
  </label>
</template>

<style lang="less" scoped>
input[type='radio'] {
  flex-grow: 0;
  align-self: flex-start;
  margin: var(--ironsworn-spacer-lg);
}
</style>

<script setup lang="ts">
import { ISettingTruthOptionSubtableRow } from 'dataforged'
import { reactive, ref } from 'vue'
import IronBtn from '../buttons/iron-btn.vue'

const props = defineProps<{
  //@ts-ignore
  page: JournalEntryPage
  radioGroup: string
}>()

function select() {
  emitValue()
}

const topRadio = ref<HTMLElement>()
const state = reactive({ suboption: undefined as string | undefined })
function subtableSelect(entry: ISettingTruthOptionSubtableRow) {
  state.suboption = entry.Result
  topRadio.value?.click()
  emitValue()
}

const $emit = defineEmits<{
  (e: 'select', categoryid: string, title: string, text: string)
}>()
function emitValue() {
  $emit(
    'select',
    props.radioGroup,
    props.page.name,
    `${props.page.system.Description} ${state.suboption ?? ''}`
  )
}
</script>
