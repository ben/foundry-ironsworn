<template>
  <div>
    <h3>Legacies</h3>

    <legacy-track :actor="actor" propKey="quests" />
    <legacy-track :actor="actor" propKey="bonds" />
    <legacy-track :actor="actor" propKey="discoveries" />
  </div>
</template>

<script>
import LegacyTrack from '../legacy-track.vue'
export default {
  props: {
    actor: Object,
  },
}
</script>
