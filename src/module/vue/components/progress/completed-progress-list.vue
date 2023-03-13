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
      :filterFn="completedFilterFn"
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
import { ItemLike } from 'component:list/helpers'
import SortableItemList from 'component:list/sortable-item-list.vue'
import ProgressListItem from 'component:progress/progress-list-item.vue'
import { computed, ExtractPropTypes, inject, ref, Ref, watch } from 'vue'
import { ActorKey } from '../../provisions'
import Collapsible from '../collapsible/collapsible.vue'

const props = defineProps<{
  collapsibleProps?: Omit<
    ExtractPropTypes<typeof Collapsible>,
    'toggleLabel' | 'baseId'
  >
  collapsibleAttrs?: Record<string, any>
  filterFn?: (
    item: ItemLike & { type: 'progress'; system: { completed: true } }
  ) => boolean | undefined
}>()

const actor = inject(ActorKey) as Ref

const completedFilterFn = computed(() => {
  const fn = (item: ItemLike) =>
    item.type === 'progress' && (item as any).system.completed
  if (props.filterFn) return (item) => fn(item) && (props.filterFn as any)(item)
  return fn
})

let $progressList = ref<InstanceType<typeof SortableItemList>>()
let $collapsible = ref<InstanceType<typeof Collapsible>>()

// collapsible inserts/removes components from DOM, so the list's exposed stuff don't always exist.
const items = computed(() => actor.value.items.filter(completedFilterFn.value))

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
