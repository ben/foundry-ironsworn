<template>
  <div class="flexcol">
    <div v-for="category in truths" :key="category.Name">
      <h2 style="margin-top: 1em">{{ category.Name }}</h2>

      <sf-truth
        v-for="(option) in category.Table"
        :key="option.Description"
        :radiogroup="category.Name"
        :description="option.Description"
        :details="option.Details"
        :quest="option['Quest Starter']"
        :table="option.Table"
        @change="radioselect"
      />

      <!-- TODO: custom truth entry -->
    </div>

    <hr />
    <!-- TODO: wire up this button -->
    <button class="ironsworn__save__truths">
      <i class="fas fa-feather"></i>
      {{ $t('IRONSWORN.SaveYourTruths') }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    truths: Array,
  },

  data() {
    const output = {}
    for (const category of this.truths) {
      output[category.Name] = null
    }

    return { output }
  },

  methods: {
    radioselect(category, value) {
      console.log(category, value)
      this.output[category] = value
    }
  }
}
</script>
