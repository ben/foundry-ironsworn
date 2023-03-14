<template>
  <component
    :is="is"
    :class="{
      [$style.tabList]: true,
      flexcol: tabState.orientation === 'vertical',
      flexrow: tabState.orientation === 'horizontal',
    }"
    role="tablist"
    :aria-orientation="tabState.orientation"
    :data-tab-set="tabState.tabSetId"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import type { TabState} from './tab-helpers.js';
import { TabStateKey } from './tab-helpers.js'
import Tab from './tab.vue'
/**
 * The container for {@link Tab}s.
 */
withDefaults(defineProps<{ is?: any }>(), { is: 'div' })
const tabState = inject(TabStateKey) as TabState

const tabSetId = computed(() => tabState?.tabSetId)
defineExpose({
  tabSetId: tabSetId.value,
})
</script>

<style lang="less" module>
.tabList {
  // TODO:
  // * fun slidey animation by applying some kind of border stroke or gradient background image, and transitioning its offset? basically, apply it to 1/n of the height or width, where n == the number of tabs.
  flex-grow: 0;

  &[aria-orientation='horizontal'] {
    flex-flow: row nowrap;
    border-bottom: var(--ironsworn-border-width-md) solid
      var(--ironsworn-color-border);
    height: max-content;
  }

  &[aria-orientation='vertical'] {
    border-right: var(--ironsworn-border-width-md) solid
      var(--ironsworn-color-border);
    border-left: var(--ironsworn-border-width-md) solid
      var(--ironsworn-color-border);
  }
}
</style>
