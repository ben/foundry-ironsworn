<template>
  <label class="nogrow flexrow">
    <input class="nogrow" type="radio" :name="radioGroup" />
    <div class="flexcol">
      <p>
        <strong>{{ page.name }}</strong>
      </p>

      <p v-html="$enrichMarkdown(page.system.Description)" />
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
const props = defineProps<{
  //@ts-ignore
  page: JournalEntryPage
  radioGroup: string
}>()
</script>
