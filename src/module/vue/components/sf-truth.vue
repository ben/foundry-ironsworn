<template>
  <div class="flexrow">
    <input
      type="radio"
      class="nogrow"
      style="flex: 0 0 20px; margin: 8px"
      :name="radiogroup"
      :id="truth?.$id"
      :value="radiovalue"
      @change="changed"
    />
    <div class="flexcol">
      <label :for="truth?.$id">
        <p>
          <strong>{{ truth?.Result }}</strong>
        </p>
        <p>{{ truth?.Description }}</p>

        <transition name="slide" v-if="truth?.Subtable">
          <div v-show="selected">
            <div
              class="flexrow"
              v-for="suboption in truth?.Subtable"
              :key="suboption.$id || ''"
            >
              <input
                type="radio"
                class="nogrow"
                style="flex: 0 0 20px; margin: 8px"
                :name="truth?.$id"
                :id="suboption.$id || ''"
                :value="suboption.Result"
                v-model="subOptionDescription"
                @change="changed"
              />
              <label :for="suboption.$id || ''">
                <p>{{ suboption.Result }}</p>
              </label>
            </div>
          </div>
        </transition>

        <p>
          <em>
            {{ $t('IRONSWORN.TruthQuestStarter') }}
            {{ truth?.['Quest Starter'] }}
          </em>
        </p>
      </label>
    </div>
  </div>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  max-height: 225px;
}
</style>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ISettingTruthOption } from 'dataforged'

export default defineComponent({
  props: {
    radiogroup: String,
    truth: Object as PropType<ISettingTruthOption>,
  },

  emits: {
    change(category: string, value: string) {
      return category.length > 0 && value.length > 0
    },
  },

  data() {
    return {
      selected: false,
      subOptionDescription: '',
    }
  },

  computed: {
    radiovalue() {
      const subOptionText = this.subOptionDescription
        ? `(${this.subOptionDescription})`
        : ''
      return `
        <p><strong>${this.truth.Result}</strong></p>
        <p>${this.truth.Description} ${subOptionText}</p>
        <p><em>
          ${this.$t('IRONSWORN.TruthQuestStarter')}
          ${this.truth['Quest Starter']}
        </em></p>
      `
    },
  },

  methods: {
    changed(evt) {
      this.selected = evt.target.checked
      this.$emit('change', this.radiogroup, this.radiovalue)
    },
  },
})
</script>
