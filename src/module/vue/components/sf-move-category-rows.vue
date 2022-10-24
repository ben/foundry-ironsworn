<template>
  <Collapsible
    :class="`${$style.wrapper} ${category.color ? $style.color : ''}`"
    :toggleButtonClass="[$style.toggleButton]"
    :toggleTooltip="$enrichMarkdown(category.dataforgedCategory?.Description)"
    :toggleWrapperIs="`h${headingLevel}`"
    :toggleWrapperClass="[$style.toggleWrapper]"
    :toggleSectionClass="[$style.toggleSection]"
    :baseId="`move_category_${snakeCase(category.displayName)}`"
    :toggleLabel="category.displayName"
    :toggleTextClass="$style.toggleText"
  >
    <template #default>
      <ul class="flexcol" :class="$style.list">
        <li
          v-for="(move, i) of category.moves"
          :key="i"
          class="nogrow"
          :class="$style['list-item']"
        >
          <SfMoverow
            :move="move"
            ref="allmoves"
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

.color {
  --ironsworn-color-thematic: v-bind('category?.color');
}

.wrapper {
  // border-width: 2px;
  // border-style: solid;
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

.list-item {
  border-color: var(--ironsworn-color-thematic);
  border-style: groove;
  border-width: 1px 0 0;
}

.toggleSection {
  transition: 0.5s ease;
  background-color: var(--ironsworn-color-thematic);
  color: var(--ironsworn-color-bg);
  border-radius: 5px;
}
.toggleButton {
  color: inherit;
  > * {
    // so it skips outlining the caret, which is a pseudo-element
    .fake-stroke();
  }
}
</style>
<script setup lang="ts">
import { ref } from 'vue'
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

let allmoves = ref<InstanceType<typeof SfMoverow>[]>([])

function collapseChildren() {
  for (const row of allmoves.value ?? []) {
    row.collapsible?.collapse()
  }
}

defineExpose({
  collapseChildren,
})
</script>
