<template>
  <div class="flexcol">
    <!-- HEADER -->
    <header class="sheet-header nogrow">
      <document-img :document="item" />
      <document-name :document="item" />
    </header>

    <select
      class="nogrow"
      v-model="item.data.subtype"
      @change="subtypeChange"
      style="margin: 0.5rem 0"
    >
      <option value="vow">{{ $t('IRONSWORN.Vow') }}</option>
      <option value="progress">{{ $t('IRONSWORN.Progress') }}</option>
      <option value="bond">{{ $t('IRONSWORN.Bond') }}</option>
    </select>

    <div class="nogrow">
      <label class="checkbox">
        <input type="checkbox" v-model="item.data.hasTrack" />
        Progress Track
      </label>

      <transition name="slide">
        <div class="nogrow" v-if="item.data.hasTrack">
          <!-- RANK -->
          <div class="flexrow nogrow">
            <rank-hexes
              :current="item.data.rank"
              @click="setRank"
              class="nogrow"
              style="margin-right: 1em"
            />
            <h4>{{ rankText }}</h4>
            <icon-button v-if="editMode" icon="trash" @click="clearProgress" />
            <icon-button icon="play" @click="markProgress" />
          </div>
          <!-- PROGRESS -->
          <div class="flexrow track nogrow" style="margin-bottom: 1em">
            <progress-track :ticks="item.data.current" />
          </div>
        </div>
      </transition>
    </div>

    <hr class="nogrow" />

    <div class="nogrow">
      <label class="checkbox">
        <input type="checkbox" v-model="item.data.hasClock" />
        Clock
      </label>

      <transition name="slide">
        <div class="nogrow" v-if="item.data.hasClock">
          (CLOCK)
        </div>
      </transition>
    </div>

    <hr class="nogrow" />

    <!-- DESCRIPTION -->
    <editor
      target="data.description"
      :owner="true"
      :button="true"
      :editable="true"
      :content="item.data.description"
    />
  </div>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
  overflow: hidden;
  max-height: 93px;
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
    item: Object,
  },

  computed: {
    editMode() {
      return this.item.flags['foundry-ironsworn']?.['edit-mode']
    },

    rankText() {
      return this.$t(CONFIG.IRONSWORN.Ranks[this.item.data.rank])
    },
  },

  methods: {
    setRank(rank) {
      this.$item.update({ data: { rank } })
    },

    clearProgress() {
      this.$item.update({ 'data.current': 0 })
    },

    markProgress() {
      const increment = CONFIG.IRONSWORN.RankIncrements[this.item.data.rank]
      const newValue = Math.min(this.item.data.current + increment, 40)
      this.$item.update({ 'data.current': newValue })
    },

    subtypeChange(...args) {
      this.$item.update({ data: { subtype: this.item.data.subtype } })
    },
  },
}
</script>
