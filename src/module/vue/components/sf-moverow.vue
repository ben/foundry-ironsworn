<template>
  <Collapsible
    class="movesheet-row"
    :class="$style['movesheet-row']"
    data-tooltip-direction="LEFT"
    :baseId="`move_row_${move.moveItem().id}`"
    ref="$el"
    :headingLevel="4"
    headerClass="flexrow"
    :headingClass="$style.heading"
    :toggleClass="$style.toggle"
  >
    <template #toggle-content>
      {{ move?.displayName }}
    </template>
    <template #after-toggle>
      <section
        :class="$style['move-controls']"
        class="nogrow"
        data-tooltip-direction="UP"
      >
        <BtnOracle
          class="juicy"
          :node="data.oracles[0] ?? {}"
          :disabled="data.oracles.length !== 1"
        />
        <BtnRollmove
          :disabled="!canRoll"
          class="juicy"
          :move="move"
          data-tooltip="IRONSWORN.Roll"
        />

        <BtnSendmovetochat class="juicy" :move="move" />
      </section>
    </template>

    <RulesTextMove
      @moveclick="moveClick"
      :move="move"
      :class="$style['move-summary']"
    >
      <template #after-footer>
        <OracleTreeNode
          class="item-row"
          v-for="node of data.oracles"
          :key="node.displayName"
          :node="node"
        />
      </template>
    </RulesTextMove>
  </Collapsible>
</template>

<style lang="less" module>
@icon_size: 1.2em;
@border_left_width: 2px;
.toggle {
  padding: 0;
  &::before {
    font-size: @icon_size;
  }
}
.heading {
  margin: 0;
  display: flex;
}
.movesheet-row {
  // TODO: fix highlighting
  transition: all 0.4s ease;
}
.move-summary {
  border-left: @border_left_width solid;
  margin-left: calc((@icon_size - @border_left_width) / 2);
  padding-left: 1rem;
}
.move-controls {
  display: flex;
  flex-flow: row;
}
</style>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import { getDFOracleByDfId } from '../../dataforged'
import { Move } from '../../features/custommoves'
import { IOracleTreeNode, walkOracle } from '../../features/customoracles'
import { IronswornHandlebarsHelpers } from '../../helpers/handlebars'
import { IronswornItem } from '../../item/item'
import { moveHasRollableOptions } from '../../rolls/preroll-dialog'
import { enrichMarkdown } from '../vue-plugin'
import BtnRollmove from './buttons/btn-rollmove.vue'
import BtnSendmovetochat from './buttons/btn-sendmovetochat.vue'
import OracleTreeNode from './oracle-tree-node.vue'
import RulesTextMove from './rules-text/rules-text-move.vue'
import { SFMoveDataProperties } from '../../item/itemtypes'
import Collapsible from './collapsible/collapsible.vue'
import BtnOracle from './buttons/btn-oracle.vue'

const props = defineProps<{ move: Move }>()
const data = reactive({
  expanded: false,
  highlighted: false,
  oracles: [] as IOracleTreeNode[],
})

const $el = ref<typeof Collapsible>()

const fulltext = computed(() => {
  const foundryMoveData = props.move.moveItem()?.data as
    | SFMoveDataProperties
    | undefined
  return IronswornHandlebarsHelpers.stripTables(
    enrichMarkdown(foundryMoveData?.data.Text ?? '')
  )
})
const canRoll = computed(() => {
  return moveHasRollableOptions(props.move.moveItem())
})

if (props.move.dataforgedMove) {
  const oracleIds = props.move.dataforgedMove.Oracles ?? []
  Promise.all(oracleIds.map(getDFOracleByDfId)).then(async (dfOracles) => {
    const nodes = await Promise.all(dfOracles.map(walkOracle))
    data.oracles.push(...nodes)
  })
}

// Inbound move clicks: if this is the intended move, expand/highlight/scroll
CONFIG.IRONSWORN.emitter.on('highlightMove', async (moveId) => {
  if (moveId === props.move.moveItem()?.id) {
    data.expanded = true
    data.highlighted = true
    await nextTick()
    $el.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    await nextTick()
    setTimeout(() => {
      data.highlighted = false
    }, 2000)
  }
})

// Outbound link clicks: broadcast events
function moveClick(move: IronswornItem) {
  CONFIG.IRONSWORN.emitter.emit('highlightMove', move.id ?? '')
}
function oracleClick(dfId: string) {
  CONFIG.IRONSWORN.emitter.emit('highlightOracle', dfId)
}

defineExpose({
  collapse: $el.value?.collapse,
  toggle: $el.value?.toggle,
  expand: $el.value?.expand,
})
</script>
