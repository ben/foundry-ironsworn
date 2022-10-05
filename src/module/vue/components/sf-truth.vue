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

        <CollapseTransition v-if="truth?.Subtable">
          <div v-show="data.selected">
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
                v-model="data.subOptionDescription"
                @change="changed"
              />
              <label :for="suboption.$id || ''">
                <p>{{ suboption.Result }}</p>
              </label>
            </div>
          </div>
        </CollapseTransition>

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

<script setup lang="ts">
import { computed, defineComponent, PropType, reactive } from 'vue'
import { ISettingTruthOption } from 'dataforged'
import CollapseTransition from './transition/collapse-transition.vue'

const props = defineProps<{
  radiogroup: string
  truth: ISettingTruthOption
}>()

const $emit = defineEmits({
  change(category: string, value: string) {
    return category.length > 0 && value.length > 0
  },
})

const data = reactive({
  selected: false,
  subOptionDescription: '',
})

const radiovalue = computed(() => {
  const subOptionText = data.subOptionDescription
    ? `(${data.subOptionDescription})`
    : ''
  return `
      <p><strong>${props.truth.Result}</strong></p>
      <p>${props.truth.Description} ${subOptionText}</p>
      <p><em>
        ${game.i18n.localize('IRONSWORN.TruthQuestStarter')}
        ${props.truth['Quest Starter']}
      </em></p>
    `
})

function changed(evt) {
  data.selected = evt.target.checked
  $emit('change', props.radiogroup, radiovalue.value)
}
</script>
