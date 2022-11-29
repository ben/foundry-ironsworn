<template>
  <Collapsible
    :class="$style.wrapper"
    :toggleButtonClass="$style.toggleButton"
    :toggleTooltip="$enrichMarkdown(category.dataforgedCategory?.Description)"
    :toggleWrapperIs="`h${headingLevel}`"
    :toggleWrapperClass="$style.toggleWrapper"
    :toggleSectionClass="$style.toggleSection"
    :baseId="`move_category_${snakeCase(category.displayName)}`"
    :toggleLabel="category.displayName"
    :toggleTextClass="$style.toggleText"
    :noClickable="true"
    ref="$collapsible"
  >
    <template #default>
      <ul class="flexcol" :class="$style.list">
        <li
          v-for="(move, i) of category.moves"
          :key="i"
          class="nogrow"
          :class="$style.listItem"
        >
          <SfMoverow
            :move="move"
            ref="children"
            :headingLevel="headingLevel + 1"
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
  --ironsworn-color-thematic: v-bind('category?.color');
  --ironsworn-color-text-outline: var(--ironsworn-color-dark);
}

.wrapper {
  .thematicColorMixin();
  border-radius: 5px;
  background-color: var(--ironsworn-color-thematic);
}

.list {
  display: flex;
  flex-flow: column nowrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.listItem {
  border-color: var(--ironsworn-color-thematic);
  border-style: groove;
  border-width: 1px 0 0;
}

.toggleSection {
  transition: 0.5s ease;
  background-color: var(--ironsworn-color-thematic);
  border-radius: 5px;
  button {
    color: var(--ironsworn-color-light);
    &:hover {
      color: var(--ironsworn-color-clickable-text-hover);
    }
  }
}
.toggleButton {
  .textStrokeMixin();
}
</style>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { MoveCategory } from '../../features/custommoves.js'
import SfMoverow from './sf-moverow.vue'
import Collapsible from './collapsible/collapsible.vue'
import { snakeCase } from 'lodash'

const props = withDefaults(
  defineProps<{
    category: MoveCategory
    headingLevel?: number
  }>(),
  { headingLevel: 3 }
)

let children = ref<InstanceType<typeof SfMoverow>[]>([])

const moves = computed(
  () =>
    new Map(
      props.category.moves.map((move) => [move.moveItem().id ?? '', move])
    )
)

const $collapsible = ref<typeof Collapsible>()

function collapseChildren() {
  for (const move of children.value ?? []) {
    move.collapsible?.collapse()
  }
}

async function scrollToAndExpandChild(targetMoveId: string) {
  if (moves.value.has(targetMoveId)) {
    await $collapsible.value?.expand()
    const targetChild = children.value.find(
      (child) => child.moveId === targetMoveId
    )
    await targetChild?.collapsible?.scrollToAndExpand()
  }
}

defineExpose({
  collapseChildren,
  moves,
  children,
  collapsible: $collapsible,
  scrollToAndExpandChild,
})
</script>
