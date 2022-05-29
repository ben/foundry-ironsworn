<template>
  <div class="flexrow">
    <div class="flexcol">
      <h5>{{ $t('IRONSWORN.Misfortunes') }}</h5>
      <condition-checkbox class="nogrow" :actor="actor" name="wounded" />
      <condition-checkbox class="nogrow" :actor="actor" name="shaken" />
      <condition-checkbox class="nogrow" :actor="actor" name="unprepared" />
    </div>
    <div class="flexcol">
      <h5>{{ $t('IRONSWORN.LastingEffects') }}</h5>
      <condition-checkbox class="nogrow" :actor="actor" name="permanentlyharmed" />
      <condition-checkbox class="nogrow" :actor="actor" name="traumatized" />
    </div>
    <div class="flexcol">
      <h5>{{ $t('IRONSWORN.Burdens') }}</h5>
      <condition-checkbox class="nogrow" :actor="actor" name="doomed" />
      <condition-checkbox class="nogrow" :actor="actor" name="tormented" />
      <condition-checkbox class="nogrow" :actor="actor" name="indebted" />
    </div>
    <div class="flexcol">
      <h5>{{ $t('IRONSWORN.Vehicle') }}</h5>
      <condition-checkbox class="nogrow" :actor="actor" name="battered" :global="true" />
      <condition-checkbox class="nogrow" :actor="actor" name="cursed" :global="true" />
    </div>
  </div>
</template>

<style lang="less" scoped>
h5 {
  flex-grow: 0;
  margin: 0.2rem 0;
}
</style>

<script>
export default {
  props: {
    actor: Object,
  },
}
</script>
