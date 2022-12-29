<template>
  <article :class="$style.sfLegacies" class="sf-legacies flexcol">
    <section class="legacy-tracks flexcol" :class="$style.legacyTracks">
      <LegacyTrack
        v-for="legacy in ['quests', 'bonds', 'discoveries']"
        :key="legacy"
        :actor="actor"
        :legacy="(legacy as any)"
        class="nogrow"
        :class="$style.legacyTrack"
      />
    </section>
    <section
      :class="$style.starredProgressTracks"
      class="starred-progress-tracks flexcol"
      v-if="starredProgresses.length"
    >
      <ProgressListItem
        v-for="(progressItem, i) in starredProgresses"
        :key="`progress-item-${i}`"
        :item="progressItem"
        :show-star="true"
        class="nogrow"
      />
    </section>
  </article>
</template>
<style lang="less" module>
.sfLegacies {
  gap: var(--ironsworn-spacer-md);
  > *:not(:first-child) {
    border-top: var(--ironsworn-border-width-md) solid
      var(--ironsworn-color-border);
  }
}

.starredProgressTracks {
  padding: var(--ironsworn-spacer-md) 0;
  gap: var(--ironsworn-spacer-md);
}
.legacyTracks {
  align-items: center;
  gap: var(--ironsworn-spacer-md);
}
.legacyTrack {
  width: 100%;
  height: max-content;
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
      (item.system as unknown as ProgressDataPropertiesData)?.starred
  )
)
</script>
