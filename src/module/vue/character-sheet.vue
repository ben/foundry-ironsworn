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

            <btn-momentumburn :actor="actor" class="nogrow block stack-row">
              {{ $t('IRONSWORN.Burn') }}
            </btn-momentumburn>

            {{ $t('IRONSWORN.Reset') }}: {{ actor.data.momentumReset }}
            {{ $t('IRONSWORN.Max') }}:
            {{ actor.data.momentumMax }}
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
                  <div
                    class="flexrow"
                    v-for="(asset, i) in assets"
                    :key="asset._id"
                  >
                    <order-buttons
                      v-if="editMode"
                      :i="i"
                      :length="assets.length"
                      @sortUp="assetSortUp"
                      @sortDown="assetSortDown"
                    />
                    <asset :actor="actor" :asset="asset" />
                  </div>
                </transition-group>
                <div class="flexrow nogrow" style="text-align: center">
                  <btn-compendium class="block" compendium="ironswornassets">
                    {{ $t('IRONSWORN.Assets') }}
                  </btn-compendium>
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
                <div
                  class="flexrow nogrow"
                  v-for="(item, i) in progressItems"
                  :key="item._id"
                >
                  <order-buttons
                    v-if="editMode"
                    :i="i"
                    :length="progressItems.length"
                    @sortUp="progressSortUp"
                    @sortDown="progressSortDown"
                  />
                  <progress-box :item="item" :actor="actor" />
                </div>
              </transition-group>

              <progress-controls :actor="actor" />
            </div>

            <quill-editor theme="bubble" v-model="actor.data.biography" />
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
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat class="vertical-v2 text" :actor="actor" attr="health">
            {{ $t('IRONSWORN.Health') }}
          </btn-rollstat>
          <div class="flexcol stack health">
            <stack :actor="actor" stat="health" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat class="vertical-v2 text" :actor="actor" attr="spirit">
            {{ $t('IRONSWORN.Spirit') }}
          </btn-rollstat>
          <div class="flexcol stack spirit">
            <stack :actor="actor" stat="spirit" :top="5" :bottom="0"></stack>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <btn-rollstat class="vertical-v2 text" :actor="actor" attr="supply">
            {{ $t('IRONSWORN.Supply') }}
          </btn-rollstat>
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
  max-height: 83px;
}

textarea.notes {
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 1px;
  font-family: var(--font-primary);
  resize: none;
  flex: 1;
  min-height: 150px;
}
</style>

<script>
export default {
  props: {
    actor: Object,
  },
  computed: {
    progressItems() {
      return this.actor.items
        .filter((x) => x.type === 'progress')
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    },
    assets() {
      return this.actor.items
        .filter((x) => x.type === 'asset')
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    },
    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
    },
  },
  watch: {
    'actor.data.biography'() {
      this.saveNotes()
    },
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
    saveNotes() {
      this.$actor.update({ 'data.biography': this.actor.data.biography })
    },
    async applySort(oldI, newI, sortBefore, collection) {
      const sorted = collection.sort(
        (a, b) => (a.data.sort || 0) - (b.data.sort || 0)
      )
      const updates = SortingHelpers.performIntegerSort(sorted[oldI], {
        target: sorted[newI],
        siblings: sorted,
        sortBefore,
      })
      await Promise.all(
        updates.map(({ target, update }) => target.update(update))
      )
    },
    assetSortUp(i) {
      const items = this.$actor.items.filter((x) => x.type === 'asset')
      this.applySort(i, i - 1, true, items)
    },
    assetSortDown(i) {
      const items = this.$actor.items.filter((x) => x.type === 'asset')
      this.applySort(i, i + 1, false, items)
    },
    progressSortUp(i) {
      const items = this.$actor.items.filter((x) => x.type === 'progress')
      this.applySort(i, i - 1, true, items)
    },
    progressSortDown(i) {
      const items = this.$actor.items.filter((x) => x.type === 'progress')
      this.applySort(i, i + 1, false, items)
    },
  },
}
</script>
