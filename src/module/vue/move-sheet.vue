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
        <div class="clickable block tab nogrow selected">Full Text</div>
        <div class="clickable block tab nogrow">Description</div>
        <div class="clickable block tab nogrow">Strong Hit</div>
      </div>
      <div class="flexcol">
        <quill-editor v-model="item.data.fulltext" />
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
    return {
      stats: {
        edge: this.item.data.stats.includes('edge'),
        heart: this.item.data.stats.includes('heart'),
        iron: this.item.data.stats.includes('iron'),
        shadow: this.item.data.stats.includes('shadow'),
        wits: this.item.data.stats.includes('wits'),
      },
    }
  },

  methods: {
    saveStats() {
      const stats = Object.keys(this.stats).filter((k) => this.stats[k])
      this.$item.update({ data: { stats } })
    },
  },
}
</script>
