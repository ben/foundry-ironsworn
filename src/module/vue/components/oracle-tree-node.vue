<template>
  <div
    class="flexcol nogrow movesheet-row"
    :class="{ hidden: node?.forceHidden, highlighted: state.highlighted }"
    ref="$el"
    data-tooltip-direction="LEFT"
  >
    <!-- TODO: split this into two components, yo -->
    <!-- Leaf node -->
    <div v-if="isLeaf">
      <h4 class="flexrow">
        <BtnOracle class="juicy text" :node="node">
          {{ node?.displayName }}
        </BtnOracle>
        <BtnFaicon
          class="block nogrow show-oracle-info"
          icon="eye"
          @click="toggleDescription()"
        />
      </h4>
      <Transition name="slide">
        <RulesTextOracle
          v-if="state.descriptionExpanded"
          @moveclick="moveclick"
          @oracleclick="oracleclick"
          :oracle-table="node.tables[0]"
          :source="node.dataforgedNode?.Source"
        />
      </Transition>
    </div>

    <!-- Branch node -->
    <div v-else>
      <h4 class="flexrow">
        <BtnFaicon
          class="juicy text"
          :icon="state.manuallyExpanded ? 'caret-down' : 'caret-right'"
          @click="toggleManually()"
        >
          {{ node?.displayName }}
        </BtnFaicon>
      </h4>

      <Transition name="slide">
        <div
          v-if="state.manuallyExpanded"
          class="flexcol"
          style="margin-left: 1rem"
        >
          <oracle-tree-node
            v-for="child in node?.children"
            :key="child.displayName"
            :node="child"
            @oracleclick="oracleclick"
            ref="children"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="less" scoped>
.show-oracle-info {
  &:before {
    padding-left: 0;
    padding-right: 0;
  }
}
.movesheet-row {
  transition: all 0.4s ease;
}
h4 {
  margin: 0;
  line-height: 1;
  height: min-content;
  button {
    line-height: 1;
    text-transform: uppercase;
    height: min-content;
  }
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
import { IOracleTreeNode } from '../../features/customoracles'
import WithRolllisteners from './with-rolllisteners.vue'
import BtnFaicon from './buttons/btn-faicon.vue'
import BtnOracle from './buttons/btn-oracle.vue'
import { $ActorKey, $EmitterKey, $EnrichMarkdownKey } from '../provisions'
import { IronswornItem } from '../../item/item'
import RulesTextOracle from './rules-text/rules-text-oracle.vue'

const props = defineProps<{ node: IOracleTreeNode }>()

const $actor = inject($ActorKey)

const state = reactive({
  manuallyExpanded: props.node.forceExpanded ?? false,
  descriptionExpanded: false,
  highlighted: false,
})

const isLeaf = computed(() => {
  return props.node.tables.length > 0
})

function toggleDescription() {
  state.descriptionExpanded = !state.descriptionExpanded
}
function toggleManually() {
  state.manuallyExpanded = !state.manuallyExpanded
}

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
  state.manuallyExpanded = false
  state.descriptionExpanded = false
  for (const child of children.value ?? []) {
    child.collapse()
  }
}
function expand() {
  state.manuallyExpanded = true
}

const $el = ref<HTMLElement>()
$emitter?.on('highlightOracle', (dfid) => {
  if (props.node.dataforgedNode?.$id === dfid) {
    state.highlighted = true
    $el.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    setTimeout(() => {
      state.highlighted = false
    }, 2000)
  }
})

defineExpose({
  dfId: () => props.node.dataforgedNode?.$id,
  expand,
  collapse,
})
</script>
