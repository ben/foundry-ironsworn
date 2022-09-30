<template>
  <article class="sf-legacies flexcol nogrow">
    <LegacyTrack
      v-for="legacy in ['quests', 'bonds', 'discoveries']"
      :key="legacy"
      :actor="actor"
      :legacy="(legacy as any)"
    />
    <hr class="nogrow" v-if="starredProgresses.length" />
    <ProgressListItem
      v-for="(progressItem, i) in starredProgresses"
      :key="`progress-item-${i}`"
      :item="progressItem"
      :actor="actor"
    />
  </article>
</template>
<style lang="less">
.sf-legacies {
  gap: 4px;
}
</style>

<script lang="ts" setup>
import { computed, inject, provide, Ref } from 'vue'
import LegacyTrack from '../legacy-track.vue'
import ProgressListItem from '../progress/progress-list-item.vue'
import { $ActorKey } from '../../provisions.js'
import { IronswornActor } from '../../../actor/actor.js'
import { IronswornItem } from '../../../item/item.js'
const props = defineProps<{ actor: IronswornActor }>()

const $actor = inject($ActorKey) as any

provide(
  'actor',
  computed(() => props.actor)
)

const starredProgresses = computed(() => {
  // console.log('$actor?.items', $actor?.items)
  const result = $actor?.items
    .filter((progressItem: IronswornItem) => progressItem.type === 'progress')
    .filter(
      (
        progressItem: IronswornItem & { data: { starred: boolean | undefined } }
      ) => progressItem.data?.starred
    )
  // console.log('$actor?.items filtered', result)
  return result
})
</script>
