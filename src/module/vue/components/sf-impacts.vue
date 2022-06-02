<template>
  <section class="impacts">
    <section class="impact-category">
      <h5 class="impact-category-title">{{ $t('IRONSWORN.Misfortunes') }}</h5>
      <condition-checkbox class="nogrow" :actor="actor" name="wounded" />
      <condition-checkbox class="nogrow" :actor="actor" name="shaken" />
      <condition-checkbox class="nogrow" :actor="actor" name="unprepared" />
    </section>
    <section class="impact-category">
      <h5 class="impact-category-title">{{ $t('IRONSWORN.LastingEffects') }}</h5>
      <condition-checkbox class="nogrow" :actor="actor" name="permanentlyharmed" />
      <condition-checkbox class="nogrow" :actor="actor" name="traumatized" />
    </section>
    <section class="impact-category">
      <h5 class="impact-category-title">{{ $t('IRONSWORN.Burdens') }}</h5>
      <condition-checkbox class="nogrow" :actor="actor" name="doomed" />
      <condition-checkbox class="nogrow" :actor="actor" name="tormented" />
      <condition-checkbox class="nogrow" :actor="actor" name="indebted" />
    </section>
    <section class="impact-category">
      <h5 class="impact-category-title">{{ $t('IRONSWORN.Vehicle') }}</h5>
      <condition-checkbox class="nogrow" :actor="actor" name="battered" :global="true" />
      <condition-checkbox class="nogrow" :actor="actor" name="cursed" :global="true" />
    </section>
  </section>
</template>

<style lang="less">
@import '../../../styles/styles.less';
@import '../../../styles/mixins.less';
.sf-character-sheet {
  .impacts {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: 0.2rem;
    justify-content: space-evenly;
    .impact-category {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: flex-start;
    }
    .impact-category-title {
      flex-grow: 0;
      margin: 0.2rem 0;
    }
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
  },
}
</script>
