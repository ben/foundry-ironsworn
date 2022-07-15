<template>
  <div class="flexrow">
    <div class="flexcol">
      <h5>{{ $t('IRONSWORN.Misfortunes') }}</h5>
      <condition-checkbox class="nogrow" name="wounded" />
      <condition-checkbox class="nogrow" name="shaken" />
      <condition-checkbox class="nogrow" name="unprepared" />
    </div>
    <div class="flexcol">
      <h5>{{ $t('IRONSWORN.LastingEffects') }}</h5>
      <condition-checkbox class="nogrow" name="permanentlyharmed" />
      <condition-checkbox class="nogrow" name="traumatized" />
    </div>
    <div class="flexcol">
      <h5>{{ $t('IRONSWORN.Burdens') }}</h5>
      <condition-checkbox class="nogrow" name="doomed" />
      <condition-checkbox class="nogrow" name="tormented" />
      <condition-checkbox class="nogrow" name="indebted" />
    </div>
    <div class="flexcol">
      <h5>{{ $t('IRONSWORN.Vehicle') }}</h5>
      <condition-checkbox class="nogrow" name="battered" :global="true" />
      <condition-checkbox class="nogrow" name="cursed" :global="true" />
    </div>
  </div>
</template>

<style lang="less" scoped>
h5 {
  flex-grow: 0;
  margin: 0.2rem 0;
}
</style>

<script setup lang="ts">
import { inject } from 'vue'
import conditionCheckbox from './conditions/condition-checkbox.vue'

const actor = inject('actor')
</script>
