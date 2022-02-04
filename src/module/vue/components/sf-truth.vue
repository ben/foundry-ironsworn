<template>
  <div class="flexrow">
    <input
      type="radio"
      :name="radiogroup"
      :id="radioid"
      class="nogrow"
      style="flex: 0 0 20px; margin: 8px"
      v-model="picked"
    />
    <div class="flexcol">
      <label :for="radioid">
        <p>
          <strong>{{ description }}</strong>
        </p>
        <p>{{ details }}</p>

        <!-- TODO: table -->

        <p>
          <em>{{ $t('IRONSWORN.TruthQuestStarter') }}{{ quest }}</em>
        </p>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    radiogroup: String,
    description: String,
    details: String,
    quest: String,
    table: Array,
  },

  computed: {
    radioid() {
      return `${this.radiogroup}#${this.description}`
    },
  },

  data() {
    return {
      picked: null,
    }
  },
}
</script>
