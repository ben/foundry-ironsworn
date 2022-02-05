<template>
  <div class="flexrow">
    <input
      type="radio"
      class="nogrow"
      style="flex: 0 0 20px; margin: 8px"
      :name="radiogroup"
      :id="radioid"
      :value="radiovalue"
      @change="changed"
    />
    <div class="flexcol">
      <label :for="radioid">
        <p>
          <strong>{{ description }}</strong>
        </p>
        <p>{{ details }}</p>

        <transition name="slide" v-if="table">
          <div v-if="selected">
            <div
              class="flexrow"
              v-for="(suboption) in table"
              :key="suboption.Description"
            >
              <input
                type="radio"
                class="nogrow"
                style="flex: 0 0 20px; margin: 8px"
                :name="description"
                :id="`${description}#${suboption.Description}`"
                :value="suboption.Description"
                v-model="subOptionDescription"
                @change="changed"
              />
              <label :for="`${description}#${suboption.Description}`">
                <p>{{ suboption.Description }}</p>
              </label>
            </div>
          </div>
        </transition>

        <p>
          <em>{{ $t('IRONSWORN.TruthQuestStarter') }} {{ quest }}</em>
        </p>
      </label>
    </div>
  </div>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
  overflow: hidden;
  max-height: 225px;
  opacity: 1;
}
.slide-enter,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
  border-top: 0;
  border-bottom: 0;
}
</style>

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

    radiovalue() {
      const subOptionText = this.subOptionDescription ? `(${this.subOptionDescription})` : ''
      return `
        <p><strong>${this.description}</strong></p>
        <p>${this.details} ${subOptionText}</p>
        <p><em>${this.$t('IRONSWORN.TruthQuestStarter')} ${this.quest}</em></p>
      `
    },
  },

  data() {
    return {
      selected: false,
      subOptionDescription: '',
    }
  },

  methods: {
    changed(evt) {
      this.selected = evt.target.checked
      this.$emit('change', this.radiogroup, this.radiovalue)
    },
  },
}
</script>
