<template>
  <div class="flexcol">
    <div v-for="category in truths" :key="category.Name">
      <h2 style="margin-top: 1em">{{ category.Name }}</h2>

      <SfTruth
        v-for="option in category.Table"
        :key="option.$id"
        :radiogroup="category.Name"
        :truth="option"
        @change="radioselect"
      />

      <!-- TODO: custom truth entry -->
    </div>

    <hr />
    <BtnFaicon class="block" icon="feather" @click="saveTruths">
      {{ $t('IRONSWORN.SaveYourTruths') }}
    </BtnFaicon>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, reactive } from 'vue'
import SfTruth from './components/sf-truth.vue'
import BtnFaicon from './components/buttons/btn-faicon.vue'
import { ISettingTruth } from 'dataforged'
import { $EmitterKey } from './provisions'

const emitter = inject($EmitterKey)

const props = defineProps<{ truths: ISettingTruth[] }>()

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

async function saveTruths() {
  const journal = await JournalEntry.create({
    name: game.i18n.localize('IRONSWORN.SFSettingTruthsTitle'),
    content: composedOutput.value,
  })
  journal?.sheet?.render(true)
  emitter?.emit('closeApp')
}
</script>
