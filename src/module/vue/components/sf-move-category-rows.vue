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
            @afterExpand="afterMoveExpand"
            :move="move"
            ref="$children"
            :headingLevel="headingLevel + 1"
            :class="$style.moveRow"
            thematicColor="transparent"
          />
        </li>
      </ul>
    </template>
  </Collapsible>
</template>

<style lang="less" module>
@import (reference) '../../../styles/mixins.less';

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
  margin: 0;
  padding: 0;
  list-style: none;
}

.toggleWrapper {
  box-sizing: content-box;
  // background-color: var(--ironsworn-color-thematic);
}

.toggleSection {
  box-sizing: content-box;
  border-radius: var(--ironsworn-border-radius-lg);

  // height: var(--ironsworn-line-height);

  button {
    --ironsworn-color-clickable-text: var(--ironsworn-color-light);
    --ironsworn-color-clickable-text-hover: var(--ironsworn-color-light-warm);
    .clickableTextMixin();

    height: inherit;
  }
}

.toggleButton {
  .textStrokeMixin( var(--ironsworn-color-dark));

  background: none;
}

.listItem {
  //
}

.moveRow {
  &:focus {
    border: 0;
    box-shadow: none;
    // outline: 1px solid var(--ironsworn-color-cool);
    // box-shadow: var(--ironsworn-box-shadow-highlight) !important;
    // TODO: figure out a better way to convey focus here.
    background-color: transparent;
  }

  &[data-highlighted='true']::after {
    .overlayMixin();
    .staticHighlightMixin(50);

    opacity: 0;
    animation: overlay-fadeout v-bind('$props.highlightDuration +"ms"')
      ease-in-out;
  }
}
@keyframes overlay-fadeout {
  0% {
    opacity: 0;
  }

  15% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
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
    /**
     * Duration of the move highlight effect, in milliseconds.
     * @default 2000
     */
    highlightDuration?: number
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
  { headingLevel: 3, highlightDuration: 2000 }
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

function collapseMoves() {
  for (const move of $children.value ?? []) {
    move.$collapsible?.collapse()
  }
}

async function expandAndHighlightMove(targetMoveId: string) {
  if ($collapsible.value?.isExpanded === false) {
    $collapsible.value.expand()
    await nextTick()
  }
  const move = $children.value.find((child) => child.moveId === targetMoveId)
  highlightMove(move?.$collapsible?.$element as HTMLElement)
  if (move?.$collapsible?.isExpanded === false) {
    await move?.$collapsible?.expand()
    // when the expand animation finishes, afterMoveExpand will focus the element
  } else {
    move?.$collapsible?.$element.focus()
  }
}

function highlightMove(element: HTMLElement) {
  element.dataset.highlighted = 'true'
  setTimeout(() => {
    element.dataset.highlighted = 'false'
  }, props.highlightDuration)
}

function afterMoveExpand(
  expandedElement?: HTMLElement,
  triggerElement?: HTMLElement,
  collapsibleElement?: HTMLElement
) {
  collapsibleElement?.focus()
}

defineExpose({
  expandAndHighlightMove,
  collapseMoves,
  moveItems: moveItems.value,
  $children,
  $collapsible,
})
</script>
