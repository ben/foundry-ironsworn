<template>
  <component :is="wrapper" class="oracle-node-leaf">
    <span class="clickable text flexrow">
      <isicon-button @click="rollOracle" class="juicy oracle-title" icon="d10-tilt">
        {{ node.displayName }}
      </isicon-button>
      <faicon-button icon="eye" @click="descriptionExpanded = !descriptionExpanded" />
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
  </component>
</template>

<script>
import { sample } from 'lodash'
export default {
  props: {
    actor: Object,
    node: Object,
    descriptionExpanded: Boolean,
    wrapper: String,
  },
  computed: {
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
    oracleclick(dfid) {
      this.$emit('oracleclick', dfid)
    },
    moveclick(item) {
      // console.log(item)
      let actorWithMoves = this.$actor
      if (this.$actor?.type !== 'character') {
        actorWithMoves = CONFIG.IRONSWORN.defaultActor()
      }
      console.log(actorWithMoves)
      actorWithMoves?.moveSheet?.render(true)
      actorWithMoves?.moveSheet?.highlightMove(item)
    },
  },
}
</script>
