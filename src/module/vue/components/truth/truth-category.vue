<template>
  <div class="flexcol" ref="root">
    <h1 class="flexrow">
      <span>{{ je().name }}</span>
      <IronBtn nogrow icon="ironsworn:d10-tilt" @click="randomize" />
    </h1>

    <TruthSelectable
      v-for="page in truthPages"
      ref="selectables"
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

<style lang="less" scoped>
h1 {
  margin-top: 1em;
}
</style>

<script lang="ts" setup>
import { ISettingTruth, ISettingTruthOption } from 'dataforged'
import { reactive, ref } from 'vue'
import { OracleRollMessage, TableRow } from '../../../rolls'
import { enrichMarkdown } from '../../vue-plugin'
import IronBtn from '../buttons/iron-btn.vue'
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

const selectedValue = () => ({
  title: props.je().name,
  html: `
    ${enrichMarkdown(`**${state.title}**`)}
    ${enrichMarkdown(state.text)}
  `.trim(),
  valid: !!state.title,
})

const root = ref<HTMLElement>()
function scrollIntoView() {
  root.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

const selectables = ref<typeof TruthSelectable[]>([])

async function randomize() {
  // Roll it like an oracle
  const rows = truthPages
    .map((p) => p.system as ISettingTruthOption)
    .map(
      (sys: ISettingTruthOption): TableRow => ({
        low: sys.Floor || 0,
        high: sys.Ceiling || 100,
        text: sys.Result,
        selected: false,
      })
    )
  const msg = OracleRollMessage.fromRows(
    rows,
    props.je().name ?? '',
    game.i18n.localize('IRONSWORN.First Start.SettingTruths')
  )
  await msg.createOrUpdate()

  // Find the result and activate it
  const result = await msg.getResult()
  const dfRow = props.df.Table.find((x) => x.Floor === result?.low)
  if (!dfRow) throw new Error('wtf')
  const idx = props.df.Table.indexOf(dfRow)
  await selectables.value[idx]?.selectAndRandomize()
}

defineExpose({ selectedValue, scrollIntoView, randomize })
</script>
