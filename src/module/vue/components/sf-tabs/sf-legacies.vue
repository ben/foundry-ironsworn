<template>
  <div>
    <h4>{{$t('IRONSWORN.Quests')}}</h4>
    <legacy-track :actor="actor" propKey="quests" />

    <hr>
    <h4>{{$t('IRONSWORN.Bonds')}}</h4>
    <legacy-track :actor="actor" propKey="bonds" />

    <hr>
    <h4>{{$t('IRONSWORN.Discoveries')}}</h4>
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
