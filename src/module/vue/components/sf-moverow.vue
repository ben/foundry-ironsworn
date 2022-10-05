<template>
  <div
    class="movesheet-row"
    :class="{ highlighted: data.highlighted }"
    ref="$el"
    data-tooltip-direction="LEFT"
  >
    <h4 class="flexrow">
      <BtnRollmove
        :disabled="!canRoll"
        class="juicy text nogrow"
        :move="move"
      />
      <span class="clickable text" @click="data.expanded = !data.expanded">
        {{ move?.displayName }}
      </span>
    </h4>
    <CollapseTransition>
      <RulesTextMove
        v-if="data.expanded"
        @moveclick="moveClick"
        :move="move"
        class="move-summary"
      >
        <template #before-main>
          <section class="move-summary-buttons flexrow">
            <BtnRollmove class="block" v-if="canRoll" :move="move">
              {{ $t('IRONSWORN.Roll') }}
            </BtnRollmove>
            <BtnSendmovetochat
              class="block"
              :move="move"
              :data-tooltip-direction="canRoll ? 'RIGHT' : 'LEFT'"
            >
              {{ $t('IRONSWORN.Chat') }}
            </BtnSendmovetochat>
          </section>
        </template>
        <template #after-footer>
          <OracleTreeNode
            class="item-row"
            v-for="node of data.oracles"
            :key="node.displayName"
            :node="node"
          />
        </template>
      </RulesTextMove>
    </CollapseTransition>
  </div>
</template>

<style lang="less" scoped>
.move-summary {
  border-left: 2px solid;
  margin-left: 5px;
  padding-left: 1rem;
  button.icon-button {
    border: 1px solid;
  }
}
h4 {
  margin: 0;
  line-height: 1.4em;
  gap: 0.2em;
}
.move-summary-buttons {
  gap: 0.5rem;
}
.movesheet-row {
  transition: all 0.4s ease;
}
</style>

<script setup lang="ts">
import { computed, inject, nextTick, reactive, ref } from 'vue'
import { getDFOracleByDfId } from '../../dataforged'
import { Move } from '../../features/custommoves'
import {
  IOracleTreeNode,
  walkAndFreezeTables,
  walkOracle,
} from '../../features/customoracles'
import { IronswornHandlebarsHelpers } from '../../helpers/handlebars'
import { IronswornItem } from '../../item/item'
import { moveHasRollableOptions } from '../../rolls/preroll-dialog'
import { enrichMarkdown } from '../vue-plugin'
import BtnRollmove from './buttons/btn-rollmove.vue'
import BtnSendmovetochat from './buttons/btn-sendmovetochat.vue'
import OracleTreeNode from './oracle-tree-node.vue'
import RulesTextMove from './rules-text/rules-text-move.vue'
import { SFMoveDataProperties } from '../../item/itemtypes'
import CollapseTransition from './transition/collapse-transition.vue'

const props = defineProps<{ move: Move }>()
const data = reactive({
  expanded: false,
  highlighted: false,
  oracles: [] as IOracleTreeNode[],
})

const fulltext = computed(() => {
  const foundryMoveData = props.move.moveItem?.data as
    | SFMoveDataProperties
    | undefined
  return IronswornHandlebarsHelpers.stripTables(
    enrichMarkdown(foundryMoveData?.data.Text ?? '')
  )
})
const canRoll = computed(() => {
  return moveHasRollableOptions(props.move.moveItem)
})

if (props.move.dataforgedMove) {
  const oracleIds = props.move.dataforgedMove.Oracles ?? []
  Promise.all(oracleIds.map(getDFOracleByDfId)).then(async (dfOracles) => {
    const nodes = await Promise.all(dfOracles.map(walkOracle))
    for (const n of nodes) {
      walkAndFreezeTables(n)
    }
    data.oracles.push(...nodes)
  })
}

const $el = ref<HTMLElement>()

// Inbound move clicks: if this is the intended move, expand/highlight/scroll
CONFIG.IRONSWORN.emitter.on('highlightMove', async (moveId) => {
  if (moveId === props.move.moveItem.id) {
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
  collapse: () => (data.expanded = false),
})
</script>
