<template>
  <div class="flexcol">
    <!-- Header row -->
    <sf-characterheader :actor="actor" />

    <!-- Main body row -->
    <div class="flexrow">
      <!-- Momentum on left -->
      <div class="flexcol margin-left">
        <div class="flexrow" style="flex-wrap: nowrap">
          <div class="flexcol stack momentum">
            <stack
              :actor="actor"
              stat="momentum"
              :top="10"
              :bottom="-6"
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

          <h4 class="vertical-v2">{{ $t('IRONSWORN.Momentum') }}</h4>
        </div>
      </div>

      <!-- Center area -->
      <div class="flexcol">
        <!-- Attributes -->
        <div class="flexrow stats">
          <attr-box :actor="actor" attr="edge"></attr-box>
          <attr-box :actor="actor" attr="heart"></attr-box>
          <attr-box :actor="actor" attr="iron"></attr-box>
          <attr-box :actor="actor" attr="shadow"></attr-box>
          <attr-box :actor="actor" attr="wits"></attr-box>
        </div>
      </div>

      <!-- Stats on right -->
      <div class="flexcol margin-right">
        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <h4 class="vertical-v2 clickable text" @click="rollStat('health')">
            {{ $t('IRONSWORN.Health') }}
          </h4>
          <div class="flexcol stack health">
            <stack :actor="actor" stat="health" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <h4 class="vertical-v2 clickable text" @click="rollStat('spirit')">
            {{ $t('IRONSWORN.Spirit') }}
          </h4>
          <div class="flexcol stack spirit">
            <stack :actor="actor" stat="spirit" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <h4 class="vertical-v2 clickable text" @click="rollStat('supply')">
            {{ $t('IRONSWORN.Supply') }}
          </h4>
          <div class="flexcol stack supply">
            <stack :actor="actor" stat="supply" :top="5" :bottom="0"></stack>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
  },

  methods: {
    burnMomentum() {
      this.$actor.burnMomentum()
    },

    rollStat(stat) {
      CONFIG.IRONSWORN.RollDialog.show({ actor: this.$actor, stat })
    },

    openCompendium(name) {
      const pack = game.packs?.get(`foundry-ironsworn.${name}`)
      pack?.render(true)
    },
  },
}
</script>
