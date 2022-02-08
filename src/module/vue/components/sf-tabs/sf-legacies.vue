<template>
  <div>
    <legacy-track propKey="quests" :title="$t('IRONSWORN.Quests')" :actor="actor" />
    <legacy-track propKey="bonds" :title="$t('IRONSWORN.Bonds')" :actor="actor" />
    <legacy-track propKey="discoveries" :title="$t('IRONSWORN.Discoveries')" :actor="actor" />
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
