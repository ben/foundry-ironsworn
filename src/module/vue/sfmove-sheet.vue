<template>
  <article class="create-move">
    <header class="sheet-header">
      <document-name :document="item" />
    </header>

    <div class="flexrow">
      <!-- Tab selection on left -->
      <nav class="flexcol nogrow tabs">
        <!-- These are always here -->
        <sfmove-tab :currentProperty="currentProperty" @click="switchContent" titleKey="FullText" property="Text" />
        <sfmove-tab
          :currentProperty="currentProperty"
          @click="switchContent"
          titleKey="Trigger"
          property="Trigger.Text"
        />

        <!-- Actions -->
        <hr class="nogrow" />
        <h4 class="flexrow nogrow">
          <span class="flexrow">Actions</span>
          <icon-button icon="fa fa-plus" @click="addTrigger" />
        </h4>
        <sfmove-tab
          v-for="option in triggerOptions"
          :key="option.key"
          :currentProperty="currentProperty"
          :title="option.title"
          :property="option.property"
          @click="switchContent($event, option.actionPropKey)"
          @delete="removeTrigger(option)"
        />

        <!-- Outcomes -->
        <hr class="nogrow" />
        <h4 class="nogrow">Outcomes</h4>
        <sfmove-tab
          :currentProperty="currentProperty"
          @click="switchContent"
          titleKey="StrongHit"
          property="Outcomes.Strong Hit.Text"
        />
        <sfmove-tab
          :currentProperty="currentProperty"
          @click="switchContent"
          titleKey="StrongHitMatch"
          property="Outcomes.Strong Hit.With a Match.Text"
        />
        <sfmove-tab
          :currentProperty="currentProperty"
          @click="switchContent"
          titleKey="WeakHit"
          property="Outcomes.Weak Hit.Text"
        />
        <sfmove-tab
          :currentProperty="currentProperty"
          @click="switchContent"
          titleKey="Miss"
          property="Outcomes.Miss.Text"
        />
        <sfmove-tab
          :currentProperty="currentProperty"
          @click="switchContent"
          titleKey="MissMatch"
          property="Outcomes.Miss.With a Match.Text"
        />
      </nav>

      <!-- Editor on right -->
      <div class="flexcol">
        <div class="flexcol nogrow" v-if="currentRollType">
          <div class="flexrow">
            <div class="flexcol">
              <label class="nogrow" v-for="x in ['Action roll', 'Progress roll']" :key="x">
                <input type="radio" name="actiontype" :value="x" v-model="currentRollType" @change="saveActionProps" />
                {{ x.split(' ')[0] }}
              </label>
            </div>
            <div class="flexcol">
              <label class="nogrow" v-for="x in ['Any', 'Highest', 'Lowest', 'All']" :key="x">
                <input type="radio" name="rollType" :value="x" v-model="currentMethod" @change="saveActionProps" />
                {{ x }}
              </label>
            </div>
          </div>
          <input v-model="currentStatText" @blur="saveActionProps" />
        </div>
        <textarea v-model="currentContent" @blur="saveText" />
      </div>
    </div>
  </article>
</template>

<script>
import { get, set } from 'lodash'

export default {
  props: {
    item: Object,
  },

  data() {
    return {
      currentProperty: 'Text',
      currentActionPropKey: undefined,
      currentContent: this.item.data.Text,
      currentRollType: undefined,
      currentMethod: undefined,
      currentStatText: undefined,
    }
  },

  computed: {
    triggerOptions() {
      const itemTriggerOptions = this.item.data.Trigger?.Options || []
      return itemTriggerOptions.map((x, i) => {
        const title = x['Action roll'] ? `Roll +${x['Action roll'].Stat}` : `${i + 1}`
        return {
          key: `option${i}`,
          title,
          actionPropKey: `Trigger.Options[${i}]`,
          property: `Trigger.Options[${i}].Text`,
        }
      })
    },
  },

  methods: {
    switchContent(prop, actionPropKey = undefined) {
      this.currentProperty = prop
      this.currentContent = get(this.item.data, prop)
      this.currentActionPropKey = actionPropKey
      // {
      //   Method: 'Any',
      //   'Roll type': 'Action roll',
      //   Text: 'Receive treatment from someone (not an ally)',
      //   Using: ['Iron'],
      //   dfid: 'Starforged/Moves/Recover/Heal/Trigger/Options/1',
      // }
      const ap = actionPropKey && get(this.item.data, actionPropKey)
      this.currentRollType = ap?.['Roll type']
      this.currentMethod = ap?.Method
      this.currentStatText = ap?.Using?.join?.(',') ?? ''
    },

    addTrigger() {
      let { Options } = this.item.data.Trigger
      Options ||= []
      Options.push({
        Text: '',
        Method: 'Any',
        'Roll type': 'Action roll',
        Using: 'Iron',
      })
      this.$item.update({ data: { Trigger: { Options } } })
    },

    removeTrigger(option) {
      console.log(option)
      const idx = this.triggerOptions.findIndex((x) => x.key === option.key)
      let { Options } = this.item.data.Trigger
      Options ||= []
      Options.splice(idx, 1)
      this.$item.update({ data: { Trigger: { Options } } })
      this.switchContent('Text')
    },

    saveActionProps() {
      const opt = get(this.item.data, this.currentActionPropKey)
      opt.Method = this.currentMethod
      opt['Roll type'] = this.currentRollType
      opt.Using = this.currentStatText.split(',').map((x) => x.trim())
      set(this.item.data, this.currentActionPropKey, opt)
      this.$item.update({ data: this.item.data })
    },

    saveText() {
      if (this.currentProperty.includes('Options')) {
        set(this.item.data, this.currentProperty, this.currentContent)
        const { Options } = this.item.data.Trigger
        this.$item.update({ data: { Trigger: { Options } } })
      } else {
        this.$item.update({
          data: { [this.currentProperty]: this.currentContent },
        })
      }
    },
  },
}
</script>
