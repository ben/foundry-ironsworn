<template>
  <div class="flexcol">
    <header class="sheet-header">
      <document-name :document="item" />
    </header>

    <div class="flexrow">
      <!-- Tab selection on left -->
      <div class="flexcol nogrow" style="white-space: nowrap">
        <sfmove-tab
          :currentProperty="currentProperty"
          @click="switchContent"
          titleKey="FullText"
          property="Text"
        />
        <sfmove-tab
          :currentProperty="currentProperty"
          @click="switchContent"
          titleKey="Trigger"
          property="Trigger.Text"
        />

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
        />

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
      </div>

      <!-- Editor on right -->
      <div class="flexcol">
        <div class="flexcol nogrow" v-if="currentActionProps">
          (action controls)
        </div>
        <textarea v-model="currentContent" @blur="saveText" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.tab {
  padding: 5px;
  text-align: left;
}
</style>

<script>
import { get, set } from 'lodash'

export default {
  props: {
    item: Object,
  },

  data() {
    return {
      currentProperty: 'Text',
      currentContent: this.item.data.Text,
      currentActionProps: undefined,
    }
  },

  computed: {
    triggerOptions() {
      const itemTriggerOptions = this.item.data.Trigger?.Options || []
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
    },
  },

  methods: {
    switchContent(prop, actionPropKey = undefined) {
      this.currentProperty = prop
      this.currentContent = get(this.item.data, prop)
      this.currentActionProps =
        actionPropKey && get(this.item.data, actionPropKey)
    },

    addTrigger() {
      let { Options } = this.item.data.Trigger
      Options ||= []
      Options.push({ Text: '', 'Action roll': { Stat: 'Iron' } })
      this.$item.update({ data: { Trigger: { Options } } })
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
