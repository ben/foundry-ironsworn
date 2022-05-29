<template>
  <section class="momentum-widget">
    <label :for="`meter-momentum`" class="resource-meter-title h4">{{ $t('IRONSWORN.Momentum') }}</label>
    <resource-meter
      :id="`meter-momentum`"
      :actor="actor"
      :attr="`momentum`"
      :min="-6"
      :max="10"
      :softMax="actor.data.momentumMax"
    />
    <button type="button" :aria-controls="`meter-momentum`" class="clickable burn-momentum" @click="burnMomentum">
      {{ $t('IRONSWORN.Burn') }}
    </button>
    <span class="momentum-max-reset">{{ $t('IRONSWORN.Reset') }}: {{ actor.data.momentumReset }}</span>
    <span class="momentum-max-reset">{{ $t('IRONSWORN.Max') }}: {{ actor.data.momentumMax }}</span>
  </section>
</template>

<style lang="less">
.momentum-widget {
  display: grid;
  grid-template-columns: minmax(50px, max-content) max-content;
  gap: 0.5em 0;
  .resource-meter {
    grid-column: 1;
    grid-row: 1;
  }
  label {
    grid-column: 2;
    grid-row: 1;
  }
  .momentum-max-reset {
    grid-column: 1;
  }
  .burn-momentum {
    grid-column: 1;
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
  },
  methods: {
    burnMomentum() {
      this.$actor.burnMomentum()
    },
  },
}
</script>
