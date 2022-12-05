<template>
  <component
    :is="is"
    :class="{
      [$style.tabPanel]: true,
      flexcol: orientation === 'horizontal',
      flexrow: orientation === 'vertical',
    }"
    ref="$el"
    role="tabpanel"
    :aria-labelledby="`tabs--${tabState._id}--tab--${index}`"
    :id="`tabs--${tabState._id}--panel--${index}`"
    tabindex="-1"
    :hidden="!isActive"
    v-show="isActive"
  >
    <slot></slot>
  </component>
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
  TabOrientationKey,
  TabState,
  TabStateKey,
} from './tab-helpers.js'

/**
 * The container for the content associated with a {@link Tab}. Should be descended from a {@link TabPanels} component.
 */
const props = withDefaults(
  defineProps<{
    /**
     * The index must match that of a {@link Tab} with the same parent {@link TabSet} element.
     */
    index: number
    /**
     * @defaultValue 'div'
     */
    is?: any
  }>(),
  { is: 'div' }
)
const tabState = inject(TabStateKey) as TabState
const setActivePanelRef = inject(SetActivePanelRefKey) as SetActivePanelRef
const orientation = inject(TabOrientationKey)

const isActive = computed(() => tabState.activeTab === props.index)

const $el = ref<HTMLElement>() as Ref<HTMLElement>

const tabSetId = computed(() => tabState?._id)
defineExpose({
  tabSetId: tabSetId.value,
})

watch(isActive, () => isActive.value && setActivePanelRef($el.value))
</script>
