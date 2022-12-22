<template>
  <label class="nogrow flexrow">
    <input class="nogrow" type="radio" :name="radioGroup" />
    <div class="flexcol">
      <p>
        <strong>{{ page.name }}</strong>
      </p>

      <div v-html="$enrichMarkdown(page.system.Description)" />

      <section v-if="page.system.Subtable">
        <label class="flexrow nogrow" v-for="entry in page.system.Subtable">
          <input type="radio" class="nogrow" :name="page.system.dfid" />
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
import IronBtn from '../buttons/iron-btn.vue'

const props = defineProps<{
  //@ts-ignore
  page: JournalEntryPage
  radioGroup: string
}>()
</script>
