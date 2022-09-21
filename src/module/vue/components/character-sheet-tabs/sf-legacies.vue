<template>
  <div>
    <legacy-track propKey="quests" :title="$t('IRONSWORN.Quests')" />
    <legacy-track propKey="bonds" :title="$t('IRONSWORN.Bonds')" />
    <legacy-track propKey="discoveries" :title="$t('IRONSWORN.Discoveries')" />

    <hr class="nogrow" v-if="starredProgresses.length > 0" />
    <progress-list-item
      v-for="item in starredProgresses"
      :key="item._id"
      :item="item"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, Ref } from 'vue'
import legacyTrack from '../xp/legacy-track.vue'
import ProgressListItem from '../progress/progress-list-item.vue'

const actor = inject('actor') as Ref

const starredProgresses = computed(() => {
  return actor.value.items
    .filter((x) => x.type === 'progress')
    .filter((x) => x.data.starred)
})
</script>
