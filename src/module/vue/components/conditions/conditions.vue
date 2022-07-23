<template>
  <div class="flexrow">
    <div class="flexcol" style="flex: 2">
      <h4>{{ $t('IRONSWORN.Conditions') }}</h4>
      <div class="flexrow">
        <div class="flexcol">
          <condition-checkbox name="wounded" />
          <condition-checkbox name="unprepared" />
        </div>
        <div class="flexcol">
          <condition-checkbox name="shaken" />
          <condition-checkbox name="encumbered" />
        </div>
      </div>
    </div>
    <div class="flexcol">
      <h4>{{ $t('IRONSWORN.Banes') }}</h4>
      <condition-checkbox name="maimed" />
      <condition-checkbox name="corrupted" />
    </div>
    <div class="flexcol">
      <h4>{{ $t('IRONSWORN.Burdens') }}</h4>
      <condition-checkbox name="cursed" />
      <condition-checkbox name="tormented" />
    </div>
  </div>
</template>

<script setup lang="ts" >
import ConditionCheckbox from './condition-checkbox.vue'
</script>
