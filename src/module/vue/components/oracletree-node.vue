<template>
  <div class="flexcol nogrow movesheet-row" :class="{ hidden: node.forceHidden, highlighted }">
    <!-- TODO: split this into two components, yo -->
    <!-- Leaf node -->
    <div v-if="isLeaf">
      <h4 class="clickable text flexrow">
        <btn-oracle class="juicy" :node="node">
          {{ node.displayName }}
        </btn-oracle>
        <btn-faicon v-if="isLeaf" icon="eye" @click="descriptionExpanded = !descriptionExpanded" />
      </h4>

      <transition name="slide">
        <with-rolllisteners
          element="div"
          :actor="actor"
          @moveclick="moveclick"
          @oracleclick="oracleclick"
          class="flexcol"
          v-if="descriptionExpanded"
          v-html="tablePreview"
        >
        </with-rolllisteners>
      </transition>
    </div>

    <!-- Branch node -->
    <div v-else>
      <h4 class="flexrow">
        <btn-faicon
          :icon="caretIcon"
          class="clickable text nogrow"
          @click="manuallyExpanded = !manuallyExpanded"
          style="flex-basis: 15px"
        >
          {{ node.displayName }}
        </btn-faicon>
      </h4>
      <transition name="slide">
        <div class="flexcol" v-if="expanded" style="margin-left: 1rem">
          <oracletree-node
            v-for="child in node.children"
            :key="child.displayName"
            :actor="actor"
            :node="child"
            @oracleclick="oracleclick"
            ref="children"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="less" scoped>
h4 {
  margin-bottom: 4px;
}
.hidden {
  display: none;
}
.slide-enter-active,
.slide-leave-active {
  max-height: 1000px;
}
</style>

<script>
import { sample } from 'lodash'
export default {
  props: {
    actor: Object,
    node: Object,
  },
  data() {
    return {
      manuallyExpanded: false,
      descriptionExpanded: false,
      highlighted: false,
    }
  },
  computed: {
    isLeaf() {
      return this.node.tables.length > 0
    },
    expanded() {
      return this.manuallyExpanded || this.node.forceExpanded
    },
    tablePreview() {
      const texts = this.node.tables.map((table) => {
        const description = table.data.description || ''
        const tableRows = CONFIG.IRONSWORN._.sortBy(
          table.data.results.contents.map((x) => ({
            low: x.data.range[0],
            high: x.data.range[1],
            text: x.data.text,
            selected: false,
          })),
          'low'
        )
        const markdownTable = [
          '| Roll | Result |',
          '| --- | --- |',
          ...tableRows.map((x) => `| ${x.low}-${x.high} | ${x.text} |`),
        ].join('\n')
        return description + '\n\n' + markdownTable
      })
      return this.$enrichMarkdown(texts.join('\n\n'))
    },
  },
  methods: {
    caretIcon() {
      return this.expanded ? 'caret-down' : 'caret-right'
    },
    rollOracle() {
      const randomTable = sample(this.node.tables)
      CONFIG.IRONSWORN.rollAndDisplayOracleResult(randomTable)
    },
    moveclick(item) {
      console.log(item)
      let actorWithMoves = this.$actor
      if (this.$actor?.type !== 'character') {
        actorWithMoves = CONFIG.IRONSWORN.defaultActor()
      }
      console.log(actorWithMoves)
      actorWithMoves?.moveSheet?.render(true)
      actorWithMoves?.moveSheet?.highlightMove(item)
    },
    oracleclick(dfid) {
      this.$emit('oracleclick', dfid)
    },
    collapse() {
      this.manuallyExpanded = false
      this.descriptionExpanded = false
      for (const child of this.$refs.children ?? []) {
        child.collapse()
      }
    },
    expand() {
      this.manuallyExpanded = true
    },
    async highlight() {
      this.highlighted = true
      this.$el.scrollIntoView()
      await new Promise((r) => setTimeout(r, 2000))
      this.highlighted = false
    },
  },
}
</script>
