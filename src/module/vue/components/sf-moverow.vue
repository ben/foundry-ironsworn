<template>
  <Collapsible
    class="movesheet-row"
    :class="$style.wrapper"
    data-tooltip-direction="LEFT"
    :baseId="`move_row_${move.moveItem().id}`"
    ref="$collapsible"
    :toggleWrapperIs="`h${headingLevel}`"
    :toggleSectionClass="[$style.toggleSection, toggleSectionClass]"
    :noIcon="true"
    :toggleButtonClass="['bordered', $style.toggleButton, toggleButtonClass]"
    :toggleTooltip="toggleTooltip"
    :toggleWrapperClass="$style.toggleWrapper"
    :toggleLabel="move?.displayName"
    :noClickable="true"
  >
    <template #after-toggle>
      <section
        :class="$style.moveControls"
        class="nogrow"
        data-tooltip-direction="UP"
      >
        <BtnRollmove
          :disabled="!canRoll"
          class="juicy text"
          :move="move"
          :class="$style.moveButton"
        />
        <BtnOracle
          class="juicy text"
          :node="data.oracles[0] ?? {}"
          :disabled="data.oracles.length !== 1"
          :class="$style.moveButton"
        />
        <BtnSendmovetochat
          class="juicy text"
          :move="move"
          :class="$style.moveButton"
        />
      </section>
    </template>
    <template #default>
      <RulesTextMove
        @moveclick="moveClick"
        :move="move"
        :class="$style.moveSummary"
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
    </template>
  </Collapsible>
</template>

<style lang="less" module>
@import '../../../styles/mixins.less';
@import '../../../styles/clickable.less';
@import '../../../styles/mixins-text.less';

@icon_size: 1.2em;
@border_width: 2px;
@border_radius: 5px;
@wrapper_spacing: 4px;

.thematicColorMixin {
  --ironsworn-color-thematic: v-bind('thematicColor');
  --ironsworn-color-text-outline: var(--ironsworn-color-dark);
  color: var(--ironsworn-color-light);
  border-color: var(--ironsworn-color-thematic);
  background-color: var(--ironsworn-color-thematic);
}
.cardColorsMixin {
  color: var(--ironsworn-color-fg);
  border-color: var(--ironsworn-color-thematic);
  background-color: var(--ironsworn-color-bg);
}

.wrapper {
  .thematicColorMixin();
  border-radius: @border_radius;
  padding-left: @wrapper_spacing;
  padding-right: @wrapper_spacing;
  &[aria-expanded='true'] {
    padding-top: @wrapper_spacing;
    padding-bottom: @wrapper_spacing;
  }
}
.moveSummary {
  .cardColorsMixin();
  border: 1px solid var(--ironsworn-color-clickable-block-border-selected);
  padding: 0.5rem 0.5rem 0.3rem;
  border-radius: 0 @border_radius @border_radius @border_radius;
}

.moveButton {
  font-size: 1.15em;
  height: var(--ironsworn-clickable-line-height);
  aspect-ratio: 1 !important;
  align-self: center;
}

.toggleButton {
  .clickableTextMixin();
  .thematicColorMixin();
  .textStrokeMixin();
  display: flex;
  flex-direction: row;
  padding: 0.2rem 0.2rem 0.2rem 0.3rem;
  text-align: left;
  line-height: 1.25;
  font-size: var(--font-size-16);
  border-bottom-width: 0px;
  border-radius: @border_radius @border_radius 0 0;
  align-items: center;
  .wrapper[aria-expanded='true'] & {
    border-color: var(--ironsworn-color-border-highlight);
    color: var(--ironsworn-color-clickable-text-selected);
    background-color: var(--ironsworn-color-dark-overlay-strong);
  }
}

.moveControls {
  display: flex;
  flex-flow: row;
  background: none;
  --ironsworn-color-clickable-text: var(--ironsworn-color-thematic-contrast);
}

.toggleSection {
  gap: @wrapper_spacing;
  display: flex;
  flex-flow: row nowrap;
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
  defineProps<{
    move: Move
    headingLevel?: number
    thematicColor?: string | null
    toggleSectionClass?: any
    toggleButtonClass?: any
  }>(),
  { headingLevel: 4, toggleSectionClass: '', toggleButtonClass: '' }
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

const moveId = computed(() => props.move.moveItem().id)

if (props.move.dataforgedMove) {
  const oracleIds = props.move.dataforgedMove.Oracles ?? []
  Promise.all(oracleIds.map(getDFOracleByDfId)).then(async (dfOracles) => {
    const nodes = await Promise.all(dfOracles.map(walkOracle))
    data.oracles.push(...nodes)
  })
}

// Inbound move clicks: if this is the intended move, expand/highlight/scroll
CONFIG.IRONSWORN.emitter.on('highlightMove', async (targetMoveId) => {
  if (targetMoveId === moveId.value) {
    $collapsible.value?.scrollToAndExpand()
  }
})

// Outbound link clicks: broadcast events
function moveClick(move: IronswornItem) {
  CONFIG.IRONSWORN.emitter.emit('highlightMove', move.id ?? '')
}

defineExpose({
  moveId,
  collapsible: $collapsible,
})
</script>
