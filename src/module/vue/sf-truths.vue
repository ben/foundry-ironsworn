<template>
  <div class="flexcol">
    <div v-for="category in truths" :key="category.Name">
      <h2 style="margin-top: 1em">{{ category.Name }}</h2>

      <sf-truth
        v-for="option in category.Table"
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
    <button
      class="ironsworn__sf__save__truths"
      @click.prevent="$root.$emit('submit', composedOutput)"
    >
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
  },
}
</script>
