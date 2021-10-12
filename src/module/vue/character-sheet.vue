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

        <div class="flexrow">
          <div class="flexcol">
            <section class="sheet-area flexcol">
              <!-- Bonds -->
              <bonds :actor="actor"></bonds>

              <hr class="nogrow" />
              <!-- Assets -->
              <div
                class="flexcol ironsworn__drop__target"
                data-drop-type="asset"
              >
                <h4 class="nogrow">{{ $t('IRONSWORN.Assets') }}</h4>

                <transition-group name="slide" tag="div" class="nogrow">
                  <asset
                    v-for="asset in assets"
                    :key="asset._id"
                    :actor="actor"
                    :asset="asset"
                  />
                </transition-group>
                <div class="flexrow nogrow" style="text-align: center">
                  <div
                    class="clickable block"
                    @click="openCompendium('ironswornassets')"
                  >
                    <i class="fas fa-atlas"></i>
                    {{ $t('IRONSWORN.Assets') }}
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div class="flexcol">
            <!-- Vows & Progress -->
            <div
              class="flexcol sheet-area ironsworn__drop__target"
              data-drop-type="progress"
            >
              <transition-group name="slide" tag="div" class="nogrow">
                <progress-box
                  v-for="item in progressItems"
                  :key="item._id"
                  :item="item"
                  :actor="actor"
                />
              </transition-group>

              <progress-controls :actor="actor" />
            </div>
          </div>
        </div>

        <!-- Conditions & Banes & Burdens -->
        <section class="sheet-area nogrow">
          <conditions :actor="actor" />
        </section>
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
    <!-- <pre><code>{{foo}}</code></pre> -->
  </div>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
  overflow: hidden;
  max-height: 83px;
  opacity: 1;
}
.slide-enter,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
  border-top: 0;
  border-bottom: 0;
}
</style>

<script>
export default {
  props: {
    actor: Object,
  },

  computed: {
    progressItems() {
      return [
        ...this.actor.items.filter((x) => x.type === 'vow'),
        ...this.actor.items.filter((x) => x.type === 'progress'),
      ]
    },
    assets() {
      return this.actor.items.filter((x) => x.type === 'asset')
    },
  },

  methods: {
    burnMomentum() {
      this.$actor().burnMomentum()
    },

    rollStat(stat) {
      CONFIG.IRONSWORN.RollDialog.show({ actor: this.$actor(), stat })
    },

    openCompendium(name) {
      const pack = game.packs?.get(`foundry-ironsworn.${name}`)
      pack?.render(true)
    },
  },
}
</script>
