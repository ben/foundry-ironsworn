<template>
  <div>
    <h3>Progress Options</h3>

    <label class="checkbox">
      <input type="checkbox" v-model="flags.isProgress" @change="saveFlags" />
      Track Progress
    </label>

    <transition name="slide">
      <section v-if="flags.isProgress">
        <div class="flexrow">
          <button type="button">Actor</button>
        </div>

        <select
          class="nogrow"
          v-model="flags.progressType"
          @change="saveFlags"
          style="margin: 0.5rem 0"
        >
          <option value="vow">{{ $t('IRONSWORN.Vow') }}</option>
          <option value="progress">{{ $t('IRONSWORN.Progress') }}</option>
          <option value="bond">{{ $t('IRONSWORN.Connection') }}</option>
        </select>

        <label class="checkbox nogrow">
          <input
            type="checkbox"
            v-model="flags.completed"
            @change="saveFlags"
          />
          {{ $t('IRONSWORN.Completed') }}
        </label>

        <!-- Track -->
        <hr />
        <label class="checkbox">
          <input type="checkbox" v-model="flags.hasTrack" @change="saveFlags" />
          {{ $t('IRONSWORN.Track') }}
        </label>

        <transition name="slide">
          <div class="nogrow" v-if="flags.hasTrack">
            <!-- RANK -->
            <div class="flexrow nogrow">
              <rank-hexes
                :current="flags.trackRank"
                @click="setRank"
                class="nogrow"
                style="margin-right: 1em"
              />
              <h4>{{ rankText }}</h4>
              <icon-button
                v-if="editMode"
                icon="trash"
                @click="clearProgress"
              />
              <icon-button icon="play" @click="markProgress" />
            </div>
            <!-- PROGRESS -->
            <div class="flexrow track nogrow" style="margin-bottom: 1em">
              <progress-track :ticks="flags.trackTicks" />
            </div>
          </div>
        </transition>

        <hr />

        <label class="checkbox">
          <input type="checkbox" v-model="flags.hasClock" @change="saveFlags" />
          {{ $t('IRONSWORN.Clock') }}
        </label>

        <transition name="slide">
          <div class="flexrow nogrow" v-if="flags.hasClock">
            <div class="nogrow" style="margin: 0 1rem">
              <clock
                :wedges="flags.clockMax"
                :ticked="flags.clockTicks"
                @click="setClock"
              />
            </div>
            <div class="flexcol">
              Segments:
              <select
                class="nogrow"
                v-model="flags.clockMax"
                @change="saveFlags"
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
      </section>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    je: Object,
  },

  computed: {
    flags() {
      return this.je.flags['foundry-ironsworn']
    },

    $journalEntry() {
      return game.journal.get(this.je._id)
    },
  },

  methods: {
    async setFlag(name, value) {
      console.log(name, value)
      return this.$journalEntry?.setFlag('foundry-ironsworn', name, value)
    },

    async saveFlags() {
      for (const k of Object.keys(this.flags)) {
        await this.setFlag(k, this.flags[k])
      }
    },

    setClock(ticks) {
      this.setFlag('clockTicks', ticks)
    },
  },
}
</script>
