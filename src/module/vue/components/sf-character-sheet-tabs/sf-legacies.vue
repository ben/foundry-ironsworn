<template>
  <div>
    <legacy-track propKey="quests" :title="$t('IRONSWORN.Quests')" />
    <legacy-track propKey="bonds" :title="$t('IRONSWORN.Bonds')" />
    <legacy-track propKey="discoveries" :title="$t('IRONSWORN.Discoveries')" />

    <hr class="nogrow" v-if="starredProgresses.length > 0" />
    <progress-box
      v-for="item in starredProgresses"
      :key="item._id"
      :item="item"
    />
  </div>
</template>

<script lang="ts" setup>
import { inject, Ref } from 'vue'
import legacyTrack from '../legacy-track.vue'
import progressBox from '../progress/progress-box.vue'

const actor = inject('actor') as Ref

function starredProgresses(): any[] {
  return actor.value.items
    .filter((x) => x.type === 'progress')
    .filter((x) => x.data.starred)
}
</script>
