<template>
  <div
    class="flexcol nogrow movesheet-row"
    :class="{ hidden: node.forceHidden, highlighted }"
  >
    <!-- TODO: split this into two components, yo -->
    <!-- Leaf node -->
    <div v-if="isLeaf">
      <h4 class="clickable text flexrow">
        <span @click="rollOracle">
          <i class="isicon-d10-tilt juicy"></i>
          {{ node?.displayName }}
        </span>
        <btn-faicon
          v-if="isLeaf"
          class="block nogrow"
          icon="eye"
          @click.once="descriptionExpanded = !descriptionExpanded"
        />
      </h4>

      <transition name="slide">
        <with-rolllisteners
          v-if="descriptionExpanded"
          element="div"
          @moveclick="moveclick"
          @oracleclick="oracleclick"
          class="flexcol"
          v-html="tablePreview"
        >
        </with-rolllisteners>
      </transition>
    </div>

    <!-- Branch node -->
    <div v-else>
      <h4
        class="clickable text flexrow"
        @click="manuallyExpanded = !manuallyExpanded"
      >
        <span class="nogrow" style="flex-basis: 15px">
          <i v-if="expanded" class="fa fa-caret-down" />
          <i v-else class="fa fa-caret-right" />
        </span>
        {{ node?.displayName }}
      </h4>

      <transition name="slide">
        <div class="flexcol" v-if="expanded" style="margin-left: 1rem">
          <oracletree-node
            v-for="child in node?.children"
            :key="child.displayName"
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

<script lang="ts">
import { sample, sortBy } from 'lodash'
import { defineComponent, PropType } from 'vue'
import { OracleTreeNode } from '../../features/customoracles'
import WithRolllisteners from './with-rolllisteners.vue'
import BtnFaicon from './buttons/btn-faicon.vue'
import { getFoundrySFTableByDfId } from '../../dataforged'

export default defineComponent({
  props: {
    node: Object as PropType<OracleTreeNode>,
  },

  inject: ['$actor'],

  components: { WithRolllisteners, BtnFaicon },

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
        const tableRows = sortBy(
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
          ...tableRows.map((x) => {
            const firstCol = x.low === x.high ? x.low : `${x.low}-${x.high}`
            return `| ${firstCol} | ${x.text} |`
          }),
        ].join('\n')
        return description + '\n\n' + markdownTable
      })
      return this.$enrichMarkdown(texts.join('\n\n'))
    },
  },

  methods: {
    async rollOracle() {
      const randomTableId = sample(this.node.tableIds)
      const table =
        (await getFoundrySFTableByDfId(randomTableId)) ||
        game.tables?.get(randomTableId)
      CONFIG.IRONSWORN.rollAndDisplayOracleResult(table)
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
})
</script>
