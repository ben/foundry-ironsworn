<template>
  <div class="flexcol">
    <div v-for="truth in truths" :key="truth.Name">
      <h2 style="margin-top: 1em">{{ truth.Name }}</h2>

      <sf-truth
        v-for="(option, i) in truth.Table"
        :key="i"
        :radiogroup="truth.Name"
        :description="option.Description"
        :details="option.Details"
        :quest="option['Quest Starter']"
        :table="option.Table"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    truths: Array,
  },

  data() {
    const picked = {}
    for (const option of this.truths) {
      picked[option.Name] = null

      for (let i = 0; i < (option.Table ?? []).length; i++) {}
    }

    return { picked }
  },
}
</script>
