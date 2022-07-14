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
    <BtnFaicon class="block" icon="feather" @click.once="saveTruths">
      {{ $t('IRONSWORN.SaveYourTruths') }}
    </BtnFaicon>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SfTruth from './components/sf-truth.vue'
import BtnFaicon from './components/buttons/btn-faicon.vue'
import { ISettingTruth } from 'dataforged'

export default defineComponent({
  props: {
    truths: Array as PropType<ISettingTruth[]>,
  },

  components: { SfTruth, BtnFaicon },
  inject: ['context'],

  data() {
    const output = {}
    for (const category of this.truths ?? []) {
      output[category.Name] = null
    }

    return { output }
  },

  computed: {
    composedOutput() {
      return this.truths
        .map((category) => category.Name)
        .map((name) =>
          this.output[name]
            ? `<h2>${name}</h2>\n${this.output[name]}\n\n`
            : undefined
        )
        .filter((x) => x !== undefined)
        .join('\n')
    },
  },

  methods: {
    radioselect(category, value) {
      this.output[category] = value
    },

    async saveTruths() {
      const journal = await JournalEntry.create({
        name: game.i18n.localize('IRONSWORN.SFSettingTruthsTitle'),
        content: this.composedOutput,
      })
      journal?.sheet?.render(true)
      this.context.emitter.emit('closeApp')
    },
  },
})
</script>
