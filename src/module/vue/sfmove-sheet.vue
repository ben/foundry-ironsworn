<template>
  <div class="flexcol">
    <header class="sheet-header">
      <document-name :document="item" />
    </header>

    <!-- Stats -->
    <div class="flexrow nogrow">
      <label class="checkbox">
        <input type="checkbox" @change="saveStats" v-model="stats.edge" />
        {{ $t('IRONSWORN.Edge') }}
      </label>
      <label class="checkbox">
        <input type="checkbox" @change="saveStats" v-model="stats.heart" />
        {{ $t('IRONSWORN.Heart') }}
      </label>
      <label class="checkbox">
        <input type="checkbox" @change="saveStats" v-model="stats.iron" />
        {{ $t('IRONSWORN.Iron') }}
      </label>
      <label class="checkbox">
        <input type="checkbox" @change="saveStats" v-model="stats.shadow" />
        {{ $t('IRONSWORN.Shadow') }}
      </label>
      <label class="checkbox">
        <input type="checkbox" @change="saveStats" v-model="stats.wits" />
        {{ $t('IRONSWORN.Wits') }}
      </label>
    </div>

    <hr class="nogrow" />

    <!-- Editors -->
    <div class="flexrow">
      <div class="flexcol nogrow">
        <div
          v-for="tab in tabs"
          :key="tab.titleKey"
          :class="[
            'clickable',
            'block',
            'nogrow',
            'tab',
            { selected: currentTab === tab },
          ]"
          @click="selectTab(tab)"
        >
          {{ $t('IRONSWORN.' + tab.titleKey) }}
        </div>
      </div>
      <div class="flexcol">
        <textarea v-model="currentTab.content" @blur="saveText" />
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
    const tabs = [
      {
        titleKey: 'Description',
        property: 'description',
        content: this.item.data.description,
      },
      {
        titleKey: 'FullText',
        property: 'fulltext',
        content: this.item.data.fulltext,
      },
      {
        titleKey: 'StrongHit',
        property: 'strong',
        content: this.item.data.strong,
      },
      {
        titleKey: 'StrongHitMatch',
        property: 'strongmatch',
        content: this.item.data.strongmatch,
      },
      { titleKey: 'WeakHit', property: 'weak', content: this.item.data.weak },
      { titleKey: 'Miss', property: 'miss', content: this.item.data.miss },
      {
        titleKey: 'MissMatch',
        property: 'missmatch',
        content: this.item.data.missmatch,
      },
    ]
    return {
      stats: {
        edge: this.item.data.stats.includes('edge'),
        heart: this.item.data.stats.includes('heart'),
        iron: this.item.data.stats.includes('iron'),
        shadow: this.item.data.stats.includes('shadow'),
        wits: this.item.data.stats.includes('wits'),
      },

      tabs,
      currentTab: tabs[0],
    }
  },

  methods: {
    saveStats() {
      const stats = Object.keys(this.stats).filter((k) => this.stats[k])
      this.$item.update({ data: { stats } })
    },

    saveText() {
      const { content, property } = this.currentTab
      this.$item.update({ data: { [property]: content } })
    },

    selectTab(tab) {
      this.currentTab = tab
      this.currentTab.content = this.currentTab.content
    },
  },
}
</script>
