<template>
  <article class="sf-legacies flexcol nogrow">
    <section class="legacy-tracks">
      <LegacyTrack
        v-for="legacy in ['quests', 'bonds', 'discoveries']"
        :key="legacy"
        :actor="actor"
        :legacy="(legacy as any)"
      />
    </section>
    <section
      class="starred-progress-tracks nogrow"
      v-if="starredProgresses.length"
    >
      <ProgressListItem
        v-for="(progressItem, i) in starredProgresses"
        :key="`progress-item-${i}`"
        :item="progressItem"
        :actor="actor"
      />
    </section>
  </article>
</template>
<style lang="less">
@gap: 0.5em;
.sf-legacies {
  gap: @gap;
  > *:not(:first-child) {
    border-top: 1px solid;
  }
  .starred-progress-tracks {
    padding: @gap 0;
  }
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
  const result = props.actor.items.filter(
    (item: IronswornItem) => item.type === 'progress' && item.data?.starred
  )
  return result
})
</script>
