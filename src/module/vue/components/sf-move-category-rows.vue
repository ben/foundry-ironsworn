<template>
  <Collapsible
    class="list-block"
    :class="$style.wrapper"
    :toggleButtonClass="$style.toggleButton"
    :toggleTooltip="$enrichMarkdown(category.dataforgedCategory?.Description)"
    :toggleWrapperIs="`h${headingLevel}`"
    :toggleWrapperClass="$style.toggleWrapper"
    :toggleSectionClass="`${$style.toggleSection} list-block-header`"
    :baseId="`move_category_${snakeCase(category.displayName)}`"
    :toggleLabel="category.displayName"
    :toggleTextClass="$style.toggleText"
    ref="$collapsible"
  >
    <template #default>
      <ul class="flexcol" :class="$style.list">
        <li
          v-for="(move, i) of category.moves"
          :key="i"
          class="list-block-item nogrow"
          :class="$style.listItem"
        >
          <SfMoverow
            @afterEnter="afterExpand($event)"
            :move="move"
            ref="$children"
            :headingLevel="headingLevel + 1"
            :class="$style.moveRow"
            :thematicColor="category.color"
          />
        </li>
      </ul>
    </template>
  </Collapsible>
</template>

<style lang="less" module>
@import '../../../styles/mixins.less';

.thematicColorMixin {
  --ironsworn-color-text-stroke: var(--ironsworn-color-dark);
  --ironsworn-color-thematic: v-bind('category?.color');
}

.wrapper {
  .thematicColorMixin();
  border-radius: var(--ironsworn-border-radius-lg);
  background-color: var(--ironsworn-color-thematic);
}

.list {
  display: flex;
  flex-flow: column nowrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.toggleSection {
  background-color: var(--ironsworn-color-thematic);
  border-radius: var(--ironsworn-border-radius-lg);
  button {
    --ironsworn-color-clickable-text: var(--ironsworn-color-light);
    --ironsworn-color-clickable-text-hover: var(--ironsworn-color-light-warm);
    .clickableTextMixin();
  }
}
.toggleButton {
  .textStrokeMixin( var(--ironsworn-color-dark));
  background: none;
}
.listItem {
}
.moveRow {
}
</style>
<script setup lang="ts">
import { computed, ExtractPropTypes, nextTick, ref } from 'vue'
import { MoveCategory } from '../../features/custommoves.js'
import SfMoverow from './sf-moverow.vue'
import Collapsible from './collapsible/collapsible.vue'
import { snakeCase } from 'lodash'

const props = withDefaults(
  defineProps<{
    category: MoveCategory
    headingLevel?: number
    collapsible?: Omit<
      ExtractPropTypes<typeof Collapsible>,
      | 'toggleButtonClass'
      | 'toggleTooltip'
      | 'toggleWrapperIs'
      | 'toggleWrapperClass'
      | 'toggleSectionClass'
      | 'baseId'
      | 'toggleLabel'
      | 'toggleTextClass'
    >
  }>(),
  { headingLevel: 3 }
)

let $children = ref<InstanceType<typeof SfMoverow>[]>([])

/**
 * Index the moves in this category by their Item's `id`, so their data is exposed even when this component is collapsed.
 */
const moveItems = computed(
  () =>
    new Map(
      props.category.moves.map((move) => [move.moveItem().id ?? '', move])
    )
)

let $collapsible = ref<typeof Collapsible>()

function collapseChildren() {
  for (const move of $children.value ?? []) {
    move.$collapsible?.collapse()
  }
}

async function expandChild(targetMoveId: string) {
  if ($collapsible.value?.isExpanded === false) {
    $collapsible.value.expand()
    await nextTick()
  }
  const move = $children.value.find((child) => child.moveId === targetMoveId)

  if (move?.$collapsible?.isExpanded === false) {
    await move?.$collapsible?.expand()
  } else {
    move?.$collapsible?.$element.focus()
  }
}

function afterExpand(element: HTMLElement) {
  const scrollTarget = element.closest(`[data-move-id]`) as HTMLElement
  scrollTarget?.focus()
}

defineExpose({
  expandChild,
  collapseChildren,
  moveItems: moveItems.value,
  $children,
  $collapsible,
})
</script>
