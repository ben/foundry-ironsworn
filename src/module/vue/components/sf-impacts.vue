<template>
  <div class="grid">
    <h5>{{ $t('IRONSWORN.Misfortunes') }}</h5>
    <h5>{{ $t('IRONSWORN.LastingEffects') }}</h5>
    <h5>{{ $t('IRONSWORN.Burdens') }}</h5>
    <h5>{{ $t('IRONSWORN.Vehicle') }}</h5>

    <condition-checkbox class="nogrow" name="wounded" />
    <condition-checkbox class="nogrow" name="permanentlyharmed" />
    <condition-checkbox class="nogrow" name="doomed" />
    <condition-checkbox class="nogrow" name="battered" :global="true" />

    <condition-checkbox class="nogrow" name="shaken" />
    <condition-checkbox class="nogrow" name="traumatized" />
    <condition-checkbox class="nogrow" name="tormented" />
    <condition-checkbox class="nogrow" name="cursed" :global="true" />

    <condition-checkbox class="nogrow" name="unprepared" />
    <condition-checkbox
      class="nogrow"
      name="indebted"
      style="grid-column: 3/4"
    />

    <custom-condition-checkbox
      style="grid-column: 1 / 3"
      debilitykey="custom1"
    />
    <custom-condition-checkbox
      style="grid-column: 3 / 5"
      debilitykey="custom2"
    />
  </div>
</template>

<style lang="less" scoped>
.grid {
  grid-template-columns: repeat(4, 1fr);
}
h5 {
  flex-grow: 0;
  margin: 0.2rem 0;
}
</style>

<script setup lang="ts">
import conditionCheckbox from './conditions/condition-checkbox.vue'
import CustomConditionCheckbox from './conditions/custom-condition-checkbox.vue'
</script>
