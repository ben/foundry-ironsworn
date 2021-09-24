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

          <h4 class="vertical">{{ $t('IRONSWORN.Momentum') }}</h4>
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

        <div class="flexrow">
          <div class="flexcol">
            <section class="sheet-area">
              <bonds :actor="actor"></bonds>

              <hr />
              <h4>assets</h4>
              <!-- TODO: Assets -->
            </section>
          </div>
          <div class="flexcol">
            <!-- TODO: Vows & Progresses -->
            <div
              class="flexcol sheet-area ironsworn__drop__target"
              data-drop-type="progress"
            >
              <!-- <h3>{{ $t('IRONSWORN.Vows') }}</h3> -->
              <progress-box
                v-for="item in progressItems"
                :key="item._id"
                :item="item"
                :actor="actor"
              />
            </div>
          </div>
        </div>

        <!-- TODO: Conditions & Banes & Burdens -->
        <section class="sheet-area nogrow">
          <h4>Conditions &amp; Banes &amp; Burdens</h4>
        </section>
      </div>

      <!-- Stats on right -->
      <div class="flexcol margin-right">
        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <h4 class="vertical clickable text">{{ $t('IRONSWORN.Health') }}</h4>
          <div class="flexcol stack health">
            <stack :actor="actor" stat="health" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <h4 class="vertical clickable text">{{ $t('IRONSWORN.Spirit') }}</h4>
          <div class="flexcol stack spirit">
            <stack :actor="actor" stat="spirit" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <h4 class="vertical clickable text">{{ $t('IRONSWORN.Supply') }}</h4>
          <div class="flexcol stack supply">
            <stack :actor="actor" stat="supply" :top="5" :bottom="0"></stack>
          </div>
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
    progressItems() {
      return [
        ...this.actor.items.filter((x) => x.type === 'vow'),
        ...this.actor.items.filter((x) => x.type === 'progress'),
      ]
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
