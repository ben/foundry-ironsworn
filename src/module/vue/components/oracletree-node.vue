<template>
  <li
    role="menuitem"
    class="oracle-node flexcol nogrow movesheet-row"
    :class="{ hidden: node.forceHidden, highlighted }"
  >
    <!-- TODO: split this into two components, yo -->
    <!-- Leaf node -->
    <div v-if="isLeaf" class="oracle-node-leaf">
      <span class="h4 clickable text flexrow">
        <span @click="rollOracle">
          <i class="isicon-d10-tilt juicy"></i>
          {{ node.displayName }}
        </span>
        <icon-button v-if="isLeaf" icon="eye" @click="descriptionExpanded = !descriptionExpanded" />
      </span>

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
    <div v-else class="oracle-node-branch" aria-haspopup="true" aria-expanded="expanded">
      <span class="h4 clickable text flexrow" @click="manuallyExpanded = !manuallyExpanded">
        <span class="nogrow" style="flex-basis: 15px">
          <i v-if="expanded" class="fa fa-caret-down" />
          <i v-else class="fa fa-caret-right" />
        </span>
        {{ node.displayName }}
      </span>

      <transition name="slide">
        <ul class="flexcol" v-if="expanded" style="margin-left: 1rem">
          <oracletree-node
            v-for="child in node.children"
            :key="child.displayName"
            :actor="actor"
            :node="child"
            @oracleclick="oracleclick"
            ref="children"
          />
        </ul>
      </transition>
    </div>
  </li>
</template>

<style lang="less">
.oracle-node {
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
