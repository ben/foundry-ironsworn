<template>
  <div class="flexrow" style="position: relative">
    <nav class="flexcol">
      <IronBtn
        v-for="truth in truths"
        nogrow
        :text="truth.je().name ?? '???'"
        @click="scrollToCategory(truth.df.$id)"
      />

      <IronBtn
        nogrow
        :text="$t('IRONSWORN.SaveYourTruths')"
        icon="fa:feather"
        @click="saveTruths"
      />
    </nav>
    <section class="flexcol">
      <TruthCategory
        v-for="truth in truths"
        ref="categoryComponents"
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
  height: 100%;
}

section {
  margin-left: 15em;
}

.save-button {
  justify-self: flex-end;
}
</style>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { ISettingTruth } from 'dataforged'
import { $LocalEmitterKey } from './provisions'
import IronBtn from './components/buttons/iron-btn.vue'
import TruthCategory from './components/truth/truth-category.vue'

const props = defineProps<{
  truths: {
    df: ISettingTruth
    je: () => JournalEntry
  }[]
}>()

function scrollToCategory(dfid: string) {
  // TODO:
}

const $localEmitter = inject($LocalEmitterKey)
const categoryComponents = ref<TruthCategory[]>([])
async function saveTruths() {
  // Fetch values from the category components
  const values = categoryComponents.value
    .map((x) => x.selectedValue())
    .filter((x) => x.title)
  console.log(values)
  // const journal = await JournalEntry.create({
  //   name: game.i18n.localize('IRONSWORN.SFSettingTruthsTitle'),
  //   content: composedOutput.value,
  // })
  // journal?.sheet?.render(true)
  // $localEmitter?.emit('closeApp')
}
</script>
