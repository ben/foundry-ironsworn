<template>
  <div class="flexrow">
    <div class="flexcol" style="flex: 2">
      <h4>{{ $t('IRONSWORN.Conditions') }}</h4>
      <div class="flexrow">
        <div class="flexcol">
          <condition-checkbox :actor="actor" name="wounded" />
          <condition-checkbox :actor="actor" name="unprepared" />
        </div>
        <div class="flexcol">
          <condition-checkbox :actor="actor" name="shaken" />
          <condition-checkbox :actor="actor" name="encumbered" />
        </div>
      </div>
    </div>
    <div class="flexcol">
      <h4>{{ $t('IRONSWORN.Banes') }}</h4>
      <condition-checkbox :actor="actor" name="maimed" />
      <condition-checkbox :actor="actor" name="corrupted" />
    </div>
    <div class="flexcol">
      <h4>{{ $t('IRONSWORN.Burdens') }}</h4>
      <condition-checkbox :actor="actor" name="cursed" />
      <condition-checkbox :actor="actor" name="tormented" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
  },
}
</script>
