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
      <option value="bond">{{ $t('IRONSWORN.Connection') }}</option>
    </select>

    <hr class="nogrow" />
    <label class="checkbox nogrow">
      <input
        type="checkbox"
        v-model="item.data.completed"
        @change="saveChecks"
      />
      {{ $t('IRONSWORN.Completed') }}
    </label>
    <hr class="nogrow" />

    <div class="nogrow">
      <label class="checkbox">
        <input
          type="checkbox"
          v-model="item.data.hasTrack"
          @change="saveChecks"
        />
        {{ $t('IRONSWORN.Track') }}
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
            <btn-faicon
              class="block"
              v-if="editMode"
              icon="trash"
              @click="clearProgress"
            />
            <btn-faicon class="block" icon="play" @click="markProgress" />
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
        <input
          type="checkbox"
          v-model="item.data.hasClock"
          @change="saveChecks"
        />
        {{ $t('IRONSWORN.Clock') }}
      </label>

      <transition name="slide">
        <div class="flexrow nogrow" v-if="item.data.hasClock">
          <div class="nogrow" style="margin: 0 1rem">
            <clock
              :wedges="item.data.clockMax"
              :ticked="item.data.clockTicks"
              @click="setClock"
            />
          </div>
          <div class="flexcol">
            Segments:
            <select
              class="nogrow"
              v-model="item.data.clockMax"
              @change="clockMaxChange"
              style="margin: 0.5rem 0"
            >
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="12">12</option>
            </select>
          </div>
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
  max-height: 93px;
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

    subtypeChange() {
      this.$item.update({ data: { subtype: this.item.data.subtype } })
    },

    clockMaxChange() {
      this.$item.update({ data: { clockMax: this.item.data.clockMax } })
    },

    saveChecks() {
      this.$item.update({
        data: {
          completed: this.item.data.completed,
          hasTrack: this.item.data.hasTrack,
          hasClock: this.item.data.hasClock,
        },
      })
    },

    setClock(num) {
      this.$item.update({ data: { clockTicks: num } })
    },
  },
}
</script>
