<template>
  <header class="sheet-header">
    <document-img :document="actor" />
    <document-name :document="actor" />
    <div class="flexrow xp">
      <h4 style="flex-grow: 0; margin: 5px">{{ $t('IRONSWORN.XP') }}</h4>
      <div class="flexrow">
        <xp-box
          :actor="actor"
          v-for="n in xpArray"
          v-bind:key="n"
          :value="n"
          :current="actor.data.xp"
        />
        <xp-box :actor="actor" :value="0">×</xp-box>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    actor: Object,
  },

  data() {
    return {
      xpArray: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    }
  },
}
</script>
