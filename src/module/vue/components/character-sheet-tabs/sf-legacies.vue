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
import { computed, inject, Ref } from 'vue'
import LegacyTrack from '../legacy-track.vue'
import ProgressListItem from '../progress/progress-list-item.vue'
import { ProgressDataPropertiesData } from '../../../item/itemtypes.js'
import { ActorKey } from '../../provisions.js'

const actor = inject(ActorKey) as Ref

const starredProgresses = computed(() =>
  actor?.value.items.filter(
    (item) =>
      item.type === 'progress' &&
      (item.data as unknown as ProgressDataPropertiesData)?.starred
  )
)
</script>
