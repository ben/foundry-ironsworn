<template>
  <Collapsible
    class="movesheet-row"
    :class="$style['movesheet-row']"
    data-tooltip-direction="LEFT"
    :baseId="`move_row_${move.moveItem().id}`"
    ref="$collapsible"
    :headingLevel="headingLevel"
    headerClass="flexrow"
    :noIcon="true"
    :headingClass="$style.heading"
    :toggleClass="$style.toggle"
    :toggleTooltip="toggleTooltip"
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
          class="juicy text"
          :node="data.oracles[0] ?? {}"
          :disabled="data.oracles.length !== 1"
          :class="$style['move-button']"
        />
        <BtnRollmove
          :disabled="!canRoll"
          class="juicy text"
          :move="move"
          :class="$style['move-button']"
        />

        <BtnSendmovetochat
          class="juicy text"
          :move="move"
          :class="$style['move-button']"
        />
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
  padding-left: 0.25rem;
  text-align: left;
}

.movesheet-row {
  transition: all 0.4s ease;
}
.move-summary {
  // padding: 0.5rem;
  // border-left: @border_left_width solid;
  // margin-left: calc((@icon_size - @border_left_width) / 2);
  // padding-left: 1rem;
}
.move-controls {
  display: flex;
  flex-flow: row;
}

.move-button {
  font-size: 1.15em;
  aspect-ratio: 1 !important;
  height: inherit !important;
}

.heading {
  font-weight: bold;
  line-height: 1.5;
}
</style>

<script setup lang="ts">
import { computed, nextTick, provide, reactive, ref } from 'vue'
import { getDFOracleByDfId } from '../../dataforged'
import { Move } from '../../features/custommoves'
import { IOracleTreeNode, walkOracle } from '../../features/customoracles'
import { IronswornItem } from '../../item/item'
import { moveHasRollableOptions } from '../../rolls/preroll-dialog'
import BtnRollmove from './buttons/btn-rollmove.vue'
import BtnSendmovetochat from './buttons/btn-sendmovetochat.vue'
import OracleTreeNode from './oracle-tree-node.vue'
import RulesTextMove from './rules-text/rules-text-move.vue'
import Collapsible from './collapsible/collapsible.vue'
import BtnOracle from './buttons/btn-oracle.vue'
import { ItemKey, $ItemKey } from '../provisions.js'
import { enrichMarkdown } from '../vue-plugin.js'

const props = withDefaults(
  defineProps<{ move: Move; headingLevel?: number }>(),
  { headingLevel: 4 }
)

const $item = computed(() => props.move.moveItem() as IronswornItem)

provide(ItemKey, computed(() => $item.value.toObject()) as any)
provide($ItemKey, $item.value)

const data = reactive({
  oracles: [] as IOracleTreeNode[],
})

const $collapsible = ref<typeof Collapsible>()

const canRoll = computed(() => {
  return moveHasRollableOptions($item.value)
})

const toggleTooltip = computed(() =>
  // @ts-ignore
  enrichMarkdown($item.value.data.data.Trigger?.Text)
)

if (props.move.dataforgedMove) {
  const oracleIds = props.move.dataforgedMove.Oracles ?? []
  Promise.all(oracleIds.map(getDFOracleByDfId)).then(async (dfOracles) => {
    const nodes = await Promise.all(dfOracles.map(walkOracle))
    data.oracles.push(...nodes)
  })
}

// Inbound move clicks: if this is the intended move, expand/highlight/scroll
CONFIG.IRONSWORN.emitter.on('highlightMove', async (targetMoveId) => {
  if (targetMoveId === props.move.moveItem().id) {
    $collapsible.value?.scrollToAndExpand()
  }
})

// Outbound link clicks: broadcast events
function moveClick(move: IronswornItem) {
  CONFIG.IRONSWORN.emitter.emit('highlightMove', move.id ?? '')
}

defineExpose({
  collapsible: $collapsible,
})
</script>
