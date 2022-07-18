<template>
  <div
    class="flexcol nogrow movesheet-row"
    :class="{ hidden: node?.forceHidden, highlighted: data.highlighted }"
    ref="$el"
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
          @click="data.descriptionExpanded = !data.descriptionExpanded"
        />
      </h4>

      <transition name="slide">
        <with-rolllisteners
          v-if="data.descriptionExpanded"
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
        @click="data.manuallyExpanded = !data.manuallyExpanded"
      >
        <span class="nogrow" style="flex-basis: 15px">
          <i v-if="expanded" class="fa fa-caret-down" />
          <i v-else class="fa fa-caret-right" />
        </span>
        {{ node?.displayName }}
      </h4>

      <transition name="slide">
        <div class="flexcol" v-show="expanded" style="margin-left: 1rem">
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

<script setup lang="ts">
import { sample, sortBy } from 'lodash'
import { Component, computed, inject, reactive, ref } from 'vue'
import { OracleTreeNode } from '../../features/customoracles'
import WithRolllisteners from './with-rolllisteners.vue'
import BtnFaicon from './buttons/btn-faicon.vue'
import { $ActorKey, $EmitterKey, $EnrichMarkdownKey } from '../provisions'
import { IronswornItem } from '../../item/item'

const props = defineProps<{ node: OracleTreeNode }>()

const $actor = inject($ActorKey)

const data = reactive({
  manuallyExpanded: false,
  descriptionExpanded: false,
  highlighted: false,
})

const isLeaf = computed(() => {
  return props.node.tables.length > 0
})

const expanded = computed(() => {
  return data.manuallyExpanded || props.node.forceExpanded
})

const $enrichMarkdown = inject($EnrichMarkdownKey)
const tablePreview = computed(() => {
  const texts = props.node.tables.map((table) => {
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
  return $enrichMarkdown?.(texts.join('\n\n'))
})

async function rollOracle() {
  const table = sample(props.node.tables)
  CONFIG.IRONSWORN.rollAndDisplayOracleResult(table)
}

// Click on a move link: broadcast event
const $emitter = inject($EmitterKey)
function moveclick(item: IronswornItem) {
  $emitter?.emit('highlightMove', item.id ?? '')
}

function oracleclick(dfid) {
  $emitter?.emit('highlightOracle', dfid)
}

const children = ref([] as any[])
function collapse() {
  data.manuallyExpanded = false
  data.descriptionExpanded = false
  for (const child of children.value ?? []) {
    child.collapse()
  }
}

function expand() {
  data.manuallyExpanded = true
}

const $el = ref<HTMLElement>()
$emitter?.on('highlightOracle', (dfid) => {
  if (props.node.dataforgedNode?.$id === dfid) {
    data.highlighted = true
    $el.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    setTimeout(() => {
      data.highlighted = false
    }, 2000)
  }
})

defineExpose({
  dfId: () => props.node.dataforgedNode?.$id,
  expand,
  collapse,
})
</script>
