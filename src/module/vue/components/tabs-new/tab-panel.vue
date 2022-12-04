<template>
  <div
    :class="$style.tabPanel"
    ref="$el"
    role="tabpanel"
    :aria-labelledby="`tabs--${tabState._id}--tab--${index}`"
    :id="`tabs--${tabState._id}--panel--${index}`"
    tabindex="-1"
    :hidden="!isActive"
  >
    <slot></slot>
  </div>
</template>

<style lang="less" module>
.tabPanel {
}
</style>

<script lang="ts" setup>
import { computed, inject, Ref, ref, watch } from 'vue'
import {
  SetActivePanelRef,
  SetActivePanelRefKey,
  TabState,
  TabStateKey,
} from './tab-helpers.js'

/**
 * The container for the content associated with a {@link Tab}. Should be descended from a {@link TabPanels} component.
 */
const props = defineProps<{
  /**
   * The index must match that of a {@link Tab} with the same parent {@link Tabs} element.
   */
  index: number
}>()
const tabState = inject(TabStateKey) as TabState
const setActivePanelRef = inject(SetActivePanelRefKey) as SetActivePanelRef

const isActive = computed(() => tabState.activeTab === props.index)

const $el = ref<HTMLElement>() as Ref<HTMLElement>

watch(isActive, () => isActive.value && setActivePanelRef($el.value))
</script>
