<template>
  <IronList :class="$style.wrapper">
    <CollapseTransition group>
      <template v-for="(item, i) in items">
        <slot v-bind="{ item, i, length: items?.length ?? 0 }" name="item">
          <SortableItem :item="item" :i="i" :length="items?.length ?? 0">
            <slot v-bind="{ item }" name="itemContent"> </slot>
          </SortableItem>
        </slot>
      </template>
    </CollapseTransition>
  </IronList>
</template>

<style lang="scss" module>
.wrapper {
}
</style>

<script lang="ts" setup>
import IronList from './iron-list.vue'
import { $ActorKey, ActorKey } from '../../provisions'
import { inject, provide } from 'vue'
import { computed } from '@vue/reactivity'
import SortableItem from './sortable-item.vue'
import CollapseTransition from 'component:transition/collapse-transition.vue'

const $actor = inject($ActorKey)
const actor = inject(ActorKey)

type ItemLike = ReturnType<Item['toObject']> | Item

const props = withDefaults(
  defineProps<{
    /**
     * Function to test whether an actor's item should be included in this list
     */
    filterFn: (item?: ItemLike, key?: number | string) => boolean
  }>(),
  {}
)

const items = computed(() =>
  actor?.value.items.filter((item, index) => props.filterFn(item, index))
)
const $items = computed(() =>
  $actor?.items.filter((item, id) => props.filterFn(item, id))
)

async function applySort(
  oldIndex: number,
  newIndex: number,
  sortBefore: boolean
) {
  const foundryItems = $items.value?.sort(
    (a, b) => (a.sort || 0) - (b.sort || 0)
  )
  if (!foundryItems) throw new Error(`Actor's "items" property is undefined`)
  const updates = SortingHelpers.performIntegerSort(foundryItems[oldIndex], {
    target: (foundryItems ?? [])[newIndex],
    siblings: foundryItems,
    sortBefore,
  })
  await Promise.all(updates.map(({ target, update }) => target.update(update)))
}

function sortUp(index: number) {
  applySort(index, index - 1, true)
}
function sortDown(index: number) {
  applySort(index, index + 1, false)
}

provide('sortUp', sortUp)
provide('sortDown', sortDown)
</script>
