<template>
  <div
    class="movesheet-row"
    :class="{ highlighted: data.highlighted }"
    ref="$el"
  >
    <h4 class="flexrow" :title="tooltip">
      <btn-rollmove
        :disabled="!canRoll"
        class="juicy text nogrow"
        :move="move"
      />
      <span class="clickable text" @click="data.expanded = !data.expanded">
        {{ move?.displayName }}
      </span>
    </h4>
    <transition name="slide">
      <with-rolllisteners
        element="div"
        class="move-summary"
        v-if="data.expanded"
        @moveclick="moveClick"
      >
        <div class="move-summary-buttons flexrow">
          <btn-rollmove class="block" v-if="canRoll" :move="move">
            {{ $t('IRONSWORN.Roll') }}
          </btn-rollmove>
          <btn-sendmovetochat class="block" :move="move">
            {{ $t('IRONSWORN.Chat') }}
          </btn-sendmovetochat>
        </div>
        <div v-html="fulltext" />

        <oracle-tree-node
          class="item-row"
          v-for="node of data.oracles"
          :key="node.displayName"
          :node="node"
        />
      </with-rolllisteners>
    </transition>
  </div>
</template>

<style lang="less" scoped>
.move-roll {
  // &[aria-disabled='true'],
  // &:disabled {
  //   visibility: hidden;
  // }
}
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

.slide-enter-active,
.slide-leave-active {
  max-height: 1000px;
}
</style>

<script setup lang="ts">
import {
  computed,
  defineComponent,
  inject,
  nextTick,
  reactive,
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
import { $EmitterKey } from '../provisions'
import { enrichMarkdown } from '../vue-plugin'
import BtnRollmove from './buttons/btn-rollmove.vue'
import BtnSendmovetochat from './buttons/btn-sendmovetochat.vue'
import WithRolllisteners from './with-rolllisteners.vue'
import OracleTreeNode from './oracle-tree-node.vue'

const props = defineProps<{ move: Move }>()
const data = reactive({
  expanded: false,
  highlighted: false,
  oracles: [] as IOracleTreeNode[],
})

const tooltip = computed(() => {
  const { Title, Page } = props.move.dataforgedMove?.Source ?? {}
  if (!Title) return undefined
  return `${Title} p${Page}`
})
const fulltext = computed(() => {
  return IronswornHandlebarsHelpers.stripTables(
    enrichMarkdown(props.move.moveItem?.data?.data?.Text)
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
const $emitter = inject($EmitterKey)

// Inbound move clicks: if this is the intended move, expand/highlight/scroll
$emitter?.on('highlightMove', async (moveId) => {
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
  $emitter?.emit('highlightMove', move.id ?? '')
}
function oracleClick(dfId: string) {
  $emitter?.emit('highlightOracle', dfId)
}

defineExpose({
  collapse: () => (data.expanded = false),
})
</script>
