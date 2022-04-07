<template>
  <div class="flexcol">
    <header class="sheet-header">
      <document-name :document="item" />
    </header>

    <!-- Editors -->
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
        (stats)

        <hr class="nogrow" />
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
import { get } from 'lodash'

export default {
  props: {
    item: Object,
  },

  watch: {
    stats: {
      deep: true,
      handler(newStats, oldStats) {
        console.log(newStats, oldStats)
      },
    },
  },

  data() {
    return {
      currentProperty: 'Text',
      currentContent: this.item.data.Text,
    }
  },

  methods: {
    switchContent(prop) {
      this.currentProperty = prop
      this.currentContent = get(this.item.data, prop)
    },

    saveText() {
      this.$item.update({
        data: { [this.currentProperty]: this.currentContent },
      })
    },
  },
}
</script>
