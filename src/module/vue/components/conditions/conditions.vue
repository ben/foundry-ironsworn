<template>
  <div class="grid" :data-tooltip="$t('IRONSWORN.DEBILITY.Title')">
    <h4
      style="grid-column: 1 / 3"
      :data-tooltip="$t('IRONSWORN.DEBILITY.CONDITIONS.Description')"
    >
      {{ $t('IRONSWORN.DEBILITY.CONDITIONS.Title') }}
    </h4>
    <h4
      style="grid-column: 3"
      :data-tooltip="$t('IRONSWORN.DEBILITY.BANES.Description')"
    >
      {{ $t('IRONSWORN.DEBILITY.BANES.Title') }}
    </h4>
    <h4
      style="grid-column: 4"
      :data-tooltip="$t('IRONSWORN.DEBILITY.BURDENS.Description')"
    >
      {{ $t('IRONSWORN.DEBILITY.BURDENS.Title') }}
    </h4>

    <condition-checkbox name="wounded" :classic="true" />
    <condition-checkbox name="shaken" :classic="true" />
    <condition-checkbox name="maimed" :classic="true" />
    <condition-checkbox name="cursed" :classic="true" />

    <condition-checkbox name="unprepared" :classic="true" />
    <condition-checkbox name="encumbered" :classic="true" />
    <condition-checkbox name="corrupted" :classic="true" />
    <condition-checkbox name="tormented" :classic="true" />

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
