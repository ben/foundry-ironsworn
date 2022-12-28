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

      <div v-html="$enrichMarkdown(pageSystem.Description)" />

      <section v-if="pageSystem.Subtable">
        <label class="flexrow nogrow" v-for="entry in pageSystem.Subtable">
          <input
            type="radio"
            ref="suboptions"
            class="nogrow"
            :name="page.system.dfid"
            @change="subtableSelect(entry as any)"
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
import { ISettingTruthOption, ISettingTruthOptionSubtableRow } from 'dataforged'
import { reactive, ref } from 'vue'
import { OracleRollMessage, TableRow } from '../../../rolls'

const props = defineProps<{
  //@ts-ignore
  page: JournalEntryPage
  radioGroup: string
}>()
const pageSystem = props.page.system as ISettingTruthOption

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
  (e: 'change', title: string, text: string)
}>()
function emitValue() {
  let text = `${pageSystem.Description} ${state.suboption ?? ''}`
  const template = pageSystem['Roll template']
  if (state.suboption && template?.Description) {
    text = template.Description.replace(/\${{.*?}}/, state.suboption)
  }
  $emit('change', props.page.name, text.trim())
}

const suboptions = ref<HTMLElement[]>([])
async function selectAndRandomize() {
  topRadio.value?.click()

  if (pageSystem.Subtable) {
    const rows = pageSystem.Subtable.map(
      (x): TableRow => ({
        low: x.Floor || 0,
        high: x.Ceiling || 100,
        text: x.Result,
        selected: false,
      })
    )
    const msg = OracleRollMessage.fromRows(
      rows,
      props.page.name,
      game.i18n.localize('IRONSWORN.First Start.SettingTruths')
    )
    await msg.createOrUpdate()

    const result = await msg.getResult()
    const dfRow = pageSystem.Subtable.find((x) => x.Floor === result?.low)
    if (!dfRow) throw new Error('wtf')
    const idx = pageSystem.Subtable.indexOf(dfRow)
    suboptions.value[idx]?.click()
  }
}

defineExpose({ selectAndRandomize })
</script>
