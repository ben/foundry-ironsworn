<template>
  <article id="momentum-widget" class="momentum-widget">
    <label id="momentum-widget-label" :for="`momentum-widget`" class="resource-meter-title h4">{{
      $t('IRONSWORN.Momentum')
    }}</label>
    <resource-meter
      aria-labelledby="momentum-widget-label"
      aria-description="momentum meter"
      :orientation="orientation"
      :id="`meter-momentum`"
      :actor="actor"
      attr="momentum"
      :min="-6"
      :max="10"
      :current="current"
      :softMax="actor.data.momentumMax"
      :withPlusSigns="true"
    />
    <btn-faicon
      aria-label="Burn momentum"
      :aria-description="`Burn your momentum and reset it to ${actor.data.momentumReset}`"
      :aria-controls="`meter-momentum`"
      class="burn-momentum"
      icon="fire"
      @click="burnMomentum"
    >
      {{ $t('IRONSWORN.Burn') }}
    </btn-faicon>
    <span :aria-label="`Your momentum reset is actor.data.momentumReset`" class="momentum-max-reset"
      >{{ $t('IRONSWORN.Reset') }}: {{ actor.data.momentumReset }}</span
    >
    <span :aria-label="`Your maximum momentum is ${actor.data.momentumMax}`" class="momentum-max-reset"
      >{{ $t('IRONSWORN.Max') }}: {{ actor.data.momentumMax }}</span
    >
  </article>
</template>

<style lang="less">
.momentum-widget {
  display: grid;
  grid-template-columns: minmax(50px, max-content) max-content;
  grid-auto-rows: min-content;
  gap: 0.5em 0;
  .resource-meter {
    grid-column: 1;
    grid-row: 1;
  }
  .resource-meter-title {
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
    current: Number,
    orientation: { type: 'vertical' | 'horizontal', default: 'vertical' },
  },
  methods: {
    burnMomentum() {
      this.$actor.burnMomentum()
    },
  },
}
</script>
