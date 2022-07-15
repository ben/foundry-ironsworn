<template>
  <div>
    <legacy-track propKey="quests" :title="$t('IRONSWORN.Quests')" />
    <legacy-track propKey="bonds" :title="$t('IRONSWORN.Bonds')" />
    <legacy-track propKey="discoveries" :title="$t('IRONSWORN.Discoveries')" />

    <hr class="nogrow" v-if="starredProgresses.length > 0" />
    <!-- <progress-box
      v-for="item in starredProgresses"
      :key="item._id"
      :item="item"
      :actor="actor"
    /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import legacyTrack from '../legacy-track.vue'

export default defineComponent({
  inject: ['actor'],
  components: { legacyTrack },

  computed: {
    starredProgresses() {
      return this.actor.items
        .filter((x) => x.type === 'progress')
        .filter((x) => x.data.starred)
    },
  },
})
</script>
