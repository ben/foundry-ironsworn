<template>
  <section class="flexrow impacts">
    <section class="flexcol impact-category">
      <h5 class="impact-category-name">{{ $t('IRONSWORN.Misfortunes') }}</h5>
      <condition-checkbox class="nogrow" :actor="actor" name="wounded" />
      <condition-checkbox class="nogrow" :actor="actor" name="shaken" />
      <condition-checkbox class="nogrow" :actor="actor" name="unprepared" />
    </section>
    <section class="flexcol impact-category">
      <h5 class="impact-category-name">{{ $t('IRONSWORN.LastingEffects') }}</h5>
      <condition-checkbox
        class="nogrow"
        :actor="actor"
        name="permanentlyharmed"
      />
      <condition-checkbox class="nogrow" :actor="actor" name="traumatized" />
    </section>
    <section class="flexcol impact-category">
      <h5 class="impact-category-name">{{ $t('IRONSWORN.Burdens') }}</h5>
      <condition-checkbox class="nogrow" :actor="actor" name="doomed" />
      <condition-checkbox class="nogrow" :actor="actor" name="tormented" />
      <condition-checkbox class="nogrow" :actor="actor" name="indebted" />
    </section>
    <section class="flexcol impact-category">
      <h5 class="impact-category-name">{{ $t('IRONSWORN.Vehicle') }}</h5>
      <condition-checkbox class="nogrow" :actor="actor" name="battered" :global="true" />
      <condition-checkbox class="nogrow" :actor="actor" name="cursed" :global="true" />
    </section>
  </section>
</template>

<script>
export default {
  props: {
    actor: Object,
  },
}
</script>
