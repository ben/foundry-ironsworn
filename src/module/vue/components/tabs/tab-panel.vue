<template>
  <component
    :is="is"
    ref="$el"
    role="tabpanel"
    :aria-labelledby="getTabId(tabState.tabSetId, tabKey)"
    :id="getTabPanelId(tabState.tabSetId, tabKey)"
    tabindex="-1"
    :hidden="!isActive"
    v-show="isActive"
    :data-tab-set="tabState.tabSetId"
    :data-tab-key="tabKey"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts" setup>
import { computed, inject, Ref, ref, watch } from 'vue'
import {
  getTabId,
  getTabPanelId,
  SetActivePanelRef,
  SetActivePanelRefKey,
  TabKey,
  TabState,
  TabStateKey,
} from './tab-helpers.js'

/**
 * The container for the content associated with a {@link Tab}. Should be descended from a {@link TabPanels} component.
 */
const props = withDefaults(
  defineProps<{
    /**
     * The key must match that of a {@link Tab} with the same parent {@link TabSet} element.
     */
    tabKey: TabKey
    /**
     * @defaultValue 'div'
     */
    is?: any
  }>(),
  { is: 'div' }
)

const tabState = inject(TabStateKey) as TabState

const $el = ref<HTMLElement>() as Ref<HTMLElement>
const isActive = computed(() => tabState.activeTab === props.tabKey)
const setActivePanelRef = inject(SetActivePanelRefKey) as SetActivePanelRef

watch(isActive, () => isActive.value && setActivePanelRef($el.value))

const tabSetId = computed(() => tabState.tabSetId)
defineExpose({ tabSetId: tabSetId.value })
</script>
