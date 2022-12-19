<template>
  <div class="move-sheet flexcol">
    <SheetHeader class="nogrow">
      <document-name :document="item" />
    </SheetHeader>

    <div class="flexrow">
      <!-- Tab selection on left -->
      <div class="flexcol nogrow" style="white-space: nowrap; max-width: 33%">
        <!-- These are always here -->
        <sfmove-tab
          :currentProperty="state.currentProperty"
          @click="switchContent"
          titleKey="FullText"
          property="Text"
        />
        <sfmove-tab
          :currentProperty="state.currentProperty"
          @click="switchContent"
          titleKey="Trigger"
          property="Trigger.Text"
        />

        <!-- Actions -->
        <hr class="nogrow" />
        <h4 class="flexrow nogrow">
          <span class="flexrow">Actions</span>
          <IronBtn block @click="addTrigger" icon="fa:plus" />
        </h4>
        <sfmove-tab
          v-for="option in triggerOptions"
          :key="option.key"
          :currentProperty="state.currentProperty"
          :title="option.title"
          :property="option.property"
          @click="switchContent($event, option.actionPropKey)"
          @delete="removeTrigger(option)"
        />

        <!-- Outcomes -->
        <hr class="nogrow" />
        <h4 class="nogrow">Outcomes</h4>
        <sfmove-tab
          :currentProperty="state.currentProperty"
          @click="switchContent"
          titleKey="Strong_hit"
          property="Outcomes.Strong Hit.Text"
        />
        <sfmove-tab
          :currentProperty="state.currentProperty"
          @click="switchContent"
          titleKey="Strong_hit_match"
          property="Outcomes.Strong Hit.With a Match.Text"
        />
        <sfmove-tab
          :currentProperty="state.currentProperty"
          @click="switchContent"
          titleKey="Weak_hit"
          property="Outcomes.Weak Hit.Text"
        />
        <sfmove-tab
          :currentProperty="state.currentProperty"
          @click="switchContent"
          titleKey="Miss"
          property="Outcomes.Miss.Text"
        />
        <sfmove-tab
          :currentProperty="state.currentProperty"
          @click="switchContent"
          titleKey="Miss_match"
          property="Outcomes.Miss.With a Match.Text"
        />
      </div>

      <!-- Editor on right -->
      <div class="flexcol">
        <div class="flexcol nogrow" v-if="state.currentRollType">
          <div class="flexrow">
            <div class="flexcol">
              <label
                class="nogrow"
                v-for="x in ['Action roll', 'Progress roll']"
                :key="x"
              >
                <input
                  type="radio"
                  name="actiontype"
                  :value="x"
                  v-model="state.currentRollType"
                  @change="saveActionProps"
                />
                {{ x.split(' ')[0] }}
              </label>
            </div>
            <div class="flexcol">
              <label
                class="nogrow"
                v-for="x in ['Any', 'Highest', 'Lowest', 'All']"
                :key="x"
              >
                <input
                  type="radio"
                  name="rollType"
                  :value="x"
                  v-model="state.currentMethod"
                  @change="saveActionProps"
                />
                {{ x }}
              </label>
            </div>
          </div>
          <input v-model="state.currentStatText" @blur="saveActionProps" />
        </div>
        <textarea v-model="state.currentContent" @blur="saveText" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.movesheet-row {
  h4 {
    align-items: center;
  }
}
</style>

<script setup lang="ts">
import SheetHeader from './sheet-header.vue'
import { provide, computed, reactive, inject } from 'vue'
import { get, set } from 'lodash'
import { $ItemKey, ItemKey } from './provisions'
import DocumentName from './components/document-name.vue'
import SfmoveTab from './components/sfmove-tab.vue'
import IronBtn from './components/buttons/iron-btn.vue'

const props = defineProps<{
  item: any
}>()
provide(ItemKey, computed(() => props.item) as any)

const $item = inject($ItemKey)

const state = reactive<{
  currentProperty: string
  currentActionPropKey?: string
  currentContent: string
  currentRollType?: string
  currentMethod?: string
  currentStatText?: string
}>({
  currentProperty: 'Text',
  currentContent: props.item.system.Text,
})

const triggerOptions = computed(() => {
  const itemTriggerOptions = props.item.system.Trigger?.Options || []
  return itemTriggerOptions.map((x, i) => {
    const title = x['Action roll']
      ? `Roll +${x['Action roll'].Stat}`
      : `${i + 1}`
    return {
      key: `option${i}`,
      title,
      actionPropKey: `Trigger.Options[${i}]`,
      property: `Trigger.Options[${i}].Text`,
    }
  })
})

function switchContent(prop, actionPropKey?: string) {
  state.currentProperty = prop
  state.currentContent = get(props.item.system, prop)
  state.currentActionPropKey = actionPropKey
  // {
  //   Method: 'Any',
  //   'Roll type': 'Action roll',
  //   Text: 'Receive treatment from someone (not an ally)',
  //   Using: ['Iron'],
  //   dfid: 'Starforged/Moves/Recover/Heal/Trigger/Options/1',
  // }
  const ap =
    actionPropKey && (get(props.item.system, actionPropKey) as any | undefined)
  state.currentRollType = ap?.['Roll type']
  state.currentMethod = ap?.Method
  state.currentStatText = ap?.Using?.join?.(',') ?? ''
}

function addTrigger() {
  let { Options } = props.item.system.Trigger
  Options ||= []
  Options.push({
    Text: '',
    Method: 'Any',
    'Roll type': 'Action roll',
    Using: 'Iron',
  })
  $item?.update({ system: { Trigger: { Options } } })
}

function removeTrigger(option) {
  const idx = triggerOptions.value.findIndex((x) => x.key === option.key)
  let { Options } = props.item.system.Trigger
  Options ||= []
  Options.splice(idx, 1)
  $item?.update({ system: { Trigger: { Options } } })
  switchContent('Text')
}

function saveActionProps() {
  if (
    !state.currentActionPropKey ||
    !state.currentStatText ||
    !state.currentActionPropKey ||
    !state.currentStatText
  )
    return

  const opt = get(props.item.system, state.currentActionPropKey)
  opt.Method = state.currentMethod
  opt['Roll type'] = state.currentRollType
  opt.Using = state.currentStatText.split(',').map((x) => x.trim())
  set(props.item.system, state.currentActionPropKey, opt)
  $item?.update({ system: props.item.system })
}

function saveText() {
  if (state.currentProperty.includes('Options')) {
    set(props.item.system, state.currentProperty, state.currentContent)
    const { Options } = props.item.system.Trigger
    $item?.update({ system: { Trigger: { Options } } })
  } else {
    $item?.update({
      system: { [state.currentProperty]: state.currentContent },
    })
  }
}
</script>
