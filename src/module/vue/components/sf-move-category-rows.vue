<template>
  <article class="nogrow" :class="$style.wrapper">
    <component
      :is="`h${headingLevel}`"
      :class="$style.heading"
      :data-tooltip="$enrichMarkdown(category.dataforgedCategory?.Description)"
      data-tooltip-direction="LEFT"
    >
      {{ category.displayName }}
    </component>
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
        />
      </li>
    </ul>
  </article>
</template>

<style lang="less" module>
// TODO: have the custom moves pull their color from their directory
.wrapper {
  border-width: 2px;
  border-style: solid;
  border-radius: 5px;
  border-color: v-bind('category.dataforgedCategory?.Display.Color');
}

.list {
  display: flex;
  flex-flow: column nowrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.list-item {
  border-color: var(--ironsworn-color-border);
  border-style: outset;
  border-width: 0;

  &:not(:first-child) {
    border-top-width: 1px;
  }
}
.heading {
  margin: 0;
  border: 0;
  padding: 3px;
  background-color: v-bind('category.dataforgedCategory?.Display.Color');
  color: white;
}
</style>
<script setup lang="ts">
import { ref } from 'vue'
import { MoveCategory } from '../../features/custommoves.js'
import SfMoverow from './sf-moverow.vue'

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
