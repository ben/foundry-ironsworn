<template>
  <div class="flexcol">
    <!-- Header row -->
    <character-header :actor="actor"></character-header>

    <!-- Main body row -->
    <div class="flexrow">
      <!-- Momentum on left -->
      <div class="flexcol margin-left">
        <div class="flexrow" style="flex-wrap: nowrap">
          <div class="flexcol stack momentum">
            <stack
              :actor="actor"
              stat="momentum"
              v-bind:top="10"
              v-bind:bottom="-6"
              :softMax="actor.data.momentumMax"
            ></stack>
            <hr class="nogrow" />
            <div class="nogrow">
              <div class="clickable block stack-row" @click="burnMomentum">
                {{ $t('IRONSWORN.Burn') }}
              </div>
            </div>

            {{ $t('IRONSWORN.Reset') }}: {{ actor.data.momentumReset }}
            {{ $t('IRONSWORN.Max') }}: {{ actor.data.momentumMax }}
          </div>

          <h4 class="vertical">{{ $t('IRONSWORN.Momentum') }}</h4>
        </div>
      </div>
    </div>
    <pre><code>{{foo}}</code></pre>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
  },
  computed: {
    foo() {
      return JSON.stringify(this.actor, null, 2)
    },
  },

  methods: {
    burnMomentum() {
      // TODO:
      const actor = game.actors?.get(this.actor._id)
      actor.burnMomentum()
    },
  },
}
</script>
