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
          :key="tab.key"
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
        <!-- <editor
          v-for="tab in tabs"
          :key="tab.key"
          v-if="currentTab === tab"
          :target="tab.key"
          :content="tab.content"
          :owner="true"
          :button="true"
          :editable="true"
        /> -->
        <quill-editor v-model="currentTab.content" />
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
        content: this.item.data.description,
        key: 'data.description',
      },
      {
        titleKey: 'FullText',
        content: this.item.data.fulltext,
        key: 'data.fulltext',
      },
      {
        titleKey: 'StrongHit',
        content: this.item.data.strong,
        key: 'data.strong',
      },
      {
        titleKey: 'StrongHitMatch',
        content: this.item.data.strongmatch,
        key: 'data.strongmatch',
      },
      { titleKey: 'WeakHit', content: this.item.data.weak, key: 'data.weak' },
      { titleKey: 'Miss', content: this.item.data.miss, key: 'data.miss' },
      {
        titleKey: 'MissMatch',
        content: this.item.data.missmatch,
        key: 'data.missmatch',
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

    selectTab(tab) {
      this.currentTab = tab
      this.currentTab.content = this.$enrichHtml(this.currentTab.content)
    }
  },
}
</script>
