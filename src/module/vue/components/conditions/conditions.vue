<template>
  <div class="grid">
    <h4 style="grid-column: 1 / 3">{{ $t('IRONSWORN.Conditions') }}</h4>
    <h4 style="grid-column: 3">{{ $t('IRONSWORN.Banes') }}</h4>
    <h4 style="grid-column: 4">{{ $t('IRONSWORN.Burdens') }}</h4>

    <condition-checkbox name="wounded" />
    <condition-checkbox name="shaken" />
    <condition-checkbox name="maimed" />
    <condition-checkbox name="cursed" />

    <condition-checkbox name="unprepared" />
    <condition-checkbox name="encumbered" />
    <condition-checkbox name="corrupted" />
    <condition-checkbox name="tormented" />

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
</style>

<script setup lang="ts">
import ConditionCheckbox from './condition-checkbox.vue'
import CustomConditionCheckbox from './custom-condition-checkbox.vue'
</script>
