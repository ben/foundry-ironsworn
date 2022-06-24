<template>
  <div>
    <h3>Progress Options</h3>

    <label class="checkbox">
      <input type="checkbox" v-model="flags.isProgress" @change="saveFlags" />
      Track Progress
    </label>

    <transition name="slide">
      <section v-if="flags.isProgress">
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

        <div v-if="actorId">
          <a
            class="entity-link content-link"
            draggable="true"
            data-type="Actor"
            data-entity="Actor"
            :data-id="actorId"
            ><i class="fas fa-user"></i> Actor (drag to map)</a
          >
        </div>
        <div v-else>
          <button type="button" @click="createActor">Generate actor</button>
        </div>

        <div v-if="itemId">
          <a
            class="entity-link content-link"
            draggable="true"
            data-type="Item"
            data-entity="Item"
            :data-id="itemId"
            ><i class="fas fa-user"></i> Item (drag to sheet)</a
          >
        </div>
        <div v-else>
          <button type="button" @click="createItem">Generate item</button>
        </div>
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

    actorId() {
      const { actorId } = this.flags
      const actor = game.actors.get(actorId)
      return actor ? actorId : undefined
    },

    itemId() {
      const { itemId } = this.flags
      const item = game.items.get(itemId)
      return item ? itemId : undefined
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

    async createActor() {
      const actor = await Actor.create({
        name: this.$journalEntry.name,
        type: 'jenpc',
      })

      this.setFlag('actorId', actor.id)
    },

    async createItem() {
      const item = await Item.create({
        name: this.$journalEntry.name,
        type: 'jeprogress',
      })

      this.setFlag('itemId', item.id)
    },
  },
}
</script>
