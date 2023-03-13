<template>
  <Collapsible
    :toggleLabel="$t('IRONSWORN.Completed')"
    :disabled="!items.length"
    :class="$style.wrapper"
    toggleButtonClass="clickable text"
    :baseId="`${actor._id}_progress-completed`"
    v-bind="$props.collapsibleProps"
    ref="$collapsible"
  >
    <SortableItemList
      :filterFn="(item) => item.type === 'progress' && (item as any).system.completed"
      :class="$style.list"
      ref="$progressList"
    >
      <template #item="{ item, i, length }">
        <ProgressListItem
          :item="item"
          :i="i"
          :length="length"
          :showStar="true"
        />
      </template>
    </SortableItemList>
  </Collapsible>
</template>

<style lang="scss" module>
.wrapper {
  margin-top: var(--ironsworn-spacer-lg);
  border-width: var(--ironsworn-border-width-md);
  border-style: solid;
  border-radius: var(--ironsworn-border-radius-lg);
  border-color: var(--ironsworn-color-fg-10);
  background-color: var(--ironsworn-color-fg-10);
}

.list {
  margin: 0 var(--ironsworn-spacer-md) var(--ironsworn-spacer-md);
}

.listItem {
  border-color: var(--ironsworn-color-bg-50);
  background-color: var(--ironsworn-color-bg-50);
}
</style>

<script lang="ts" setup>
import SortableItemList from 'component:list/sortable-item-list.vue'
import ProgressListItem from 'component:progress/progress-list-item.vue'
import { computed, ExtractPropTypes, inject, ref, Ref, watch } from 'vue'
import { ActorKey } from '../../provisions'
import Collapsible from '../collapsible/collapsible.vue'
import { CompletedProgressType, getProgressItems } from '../progress-common'
import ProgressList from './progress-list.vue'

const props = defineProps<{
  collapsibleProps?: Omit<
    ExtractPropTypes<typeof Collapsible>,
    'toggleLabel' | 'baseId'
  >
  collapsibleAttrs?: Record<string, any>
  listProps?: Omit<ExtractPropTypes<typeof ProgressList>, 'showCompleted'>
  listAttrs?: Record<string, any>
}>()

const showCompleted: CompletedProgressType = 'completed-only'

const actor = inject(ActorKey) as Ref

let $progressList = ref<InstanceType<typeof ProgressList>>()
let $collapsible = ref<InstanceType<typeof Collapsible>>()

// collapsible inserts/removes components from DOM, so the list's exposed stuff don't always exist.
const items = computed(() =>
  getProgressItems(
    actor.value,
    showCompleted,
    props.listProps?.excludedSubtypes
  )
)

const editMode = computed(
  () => !!(actor.value.flags as any)['foundry-ironsworn']?.['edit-mode']
)

/**
 * If edit mode ends with 0 items, collapse automatically to avoid an open + disabled state.
 */
watch(editMode, () => {
  if (editMode.value === false && items?.value.length === 0) {
    $collapsible.value?.collapse()
  }
})

defineExpose({
  items: items.value,
  $collapsible,
  $progressList,
})
</script>
