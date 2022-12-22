<template>
  <div class="flexrow" style="position: relative">
    <nav class="flexcol">
      <IronBtn
        v-for="truth in truths"
        nogrow
        :text="truth.je().name ?? '???'"
        @click="scrollToCategory(truth.df.$id)"
      />
    </nav>
    <section class="flexcol">
      <TruthCategory
        v-for="truth in truths"
        :key="truth.df.$id"
        :df="truth.df"
        :je="truth.je"
        @select="categorySelect"
      />
    </section>
  </div>
</template>

<style lang="less" scoped>
nav {
  position: fixed;
  margin-top: 1em;
}
section {
  margin-left: 15em;
}
</style>

<script setup lang="ts">
import { computed, inject, reactive } from 'vue'
import SfTruth from './components/sf-truth.vue'
import { ISettingTruth } from 'dataforged'
import IronBtn from './components/buttons/iron-btn.vue'
import { $LocalEmitterKey } from './provisions'
import TruthCategory from './components/truth/truth-category.vue'

const props = defineProps<{
  truths: {
    df: ISettingTruth
    je: () => JournalEntry
  }[]
}>()

const output = {}
for (const category of props.truths ?? []) {
  output[category.Name] = null
}

const data = reactive({ output })

const composedOutput = computed(() =>
  props.truths
    .map((category) => category.Name)
    .map((name) =>
      data.output[name]
        ? `<h2>${name}</h2>\n${data.output[name]}\n\n`
        : undefined
    )
    .filter((x) => x !== undefined)
    .join('\n')
)
function radioselect(category, value) {
  data.output[category] = value
}

function scrollToCategory(dfid: string) {
  // TODO:
}

function categorySelect(df: ISettingTruth, title: string, value: string) {
  // TODO:
}

const $localEmitter = inject($LocalEmitterKey)
async function saveTruths() {
  const journal = await JournalEntry.create({
    name: game.i18n.localize('IRONSWORN.SFSettingTruthsTitle'),
    content: composedOutput.value,
  })
  journal?.sheet?.render(true)
  $localEmitter?.emit('closeApp')
}
</script>
