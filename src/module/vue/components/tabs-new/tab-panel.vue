<template>
  <div
    :class="$style.tabPanel"
    ref="$el"
    role="tabpanel"
    :aria-labeledby="`tabs--${tabState._id}--tab--${index}`"
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

const tabState = inject(TabStateKey) as TabState
const setActivePanelRef = inject(SetActivePanelRefKey) as SetActivePanelRef

const props = defineProps<{ index: number }>()

const isActive = computed(() => tabState.activeTab === props.index)

const $el = ref<HTMLElement>() as Ref<HTMLElement>

watch(isActive, () => isActive.value && setActivePanelRef($el.value))
</script>
