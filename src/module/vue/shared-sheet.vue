<template>
  <div class="flexcol">
    <header class="sheet-header nogrow">
      <document-img :document="actor" />
      <document-name :document="actor" />
    </header>

    <section class="sheet-area nogrow">
      <h4 class="clickable text" @click="rollSupply">
        {{ $t('IRONSWORN.Supply') }}
      </h4>

      <boxrow
        style="line-height: 25px"
        :min="0"
        :max="5"
        :current="actor.data.supply"
        @click="setSupply"
      />
    </section>

    <section v-if="hasBonds" class="sheet-area nogrow">
      <bonds :actor="actor" />
    </section>

    <section
      class="sheet-area ironsworn__drop__target"
      data-drop-type="progress"
    >
      <transition-group name="slide" tag="div" class="nogrow">
        <progress-box
          v-for="item in activeItems"
          :key="item._id"
          :item="item"
          :actor="actor"
          @completed="progressCompleted"
        />
      </transition-group>

      <progress-controls :actor="actor" />
    </section>

    <section class="item-row nogrow" style="margin-top: 1rem">
      <h3
        class="clickable text"
        :class="completedClass"
        @click="expandCompleted = !expandCompleted"
      >
        <i :class="completedCaretClass"></i> {{ $t('IRONSWORN.Completed') }}
      </h3>
      <transition
        name="slide"
        tag="div"
        class="nogrow completed"
        style="margin: 0; padding: 0"
      >
        <div v-if="expandCompleted">
          <transition-group name="slide" tag="div" class="nogrow">
            <progress-box
              v-for="item in completedItems"
              :key="item._id"
              :item="item"
              :actor="actor"
              :showStar="true"
            />
          </transition-group>
        </div>
      </transition>
    </section>

    <textarea
      class="notes"
      :placeholder="$t('IRONSWORN.Notes')"
      v-model="actor.data.biography"
      @blur="saveNotes"
    />
  </div>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  max-height: 83px;
}

h3 {
  margin: 5px 0;
  transition: background-color 0.2s ease;
  i {
    width: 15px;
    text-align: center;
  }

  &.highlighted {
    background-color: lightyellow;
  }
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

  data() {
    return {
      expandCompleted: false,
      highlightCompleted: false,
    }
  },

  computed: {
    progressItems() {
      return [
        ...this.actor.items.filter((x) => x.type === 'vow'),
        ...this.actor.items.filter((x) => x.type === 'progress'),
      ]
    },

    activeItems() {
      return this.progressItems.filter((x) => !x.data.completed)
    },
    completedItems() {
      return this.progressItems.filter((x) => x.data.completed)
    },

    completedCaretClass() {
      return 'fa fa-caret-' + (this.expandCompleted ? 'down' : 'right')
    },

    completedClass() {
      return this.highlightCompleted ? 'highlighted' : undefined
    },

    hasBonds() {
      const bonds = this.actor.items.find((x) => x.type === 'bondset')
      const markedBonds = bonds?.data?.bonds?.length
      return markedBonds && markedBonds > 0
    },
  },

  methods: {
    setSupply(_ev, value) {
      this.$actor.update({ data: { supply: value } })
      CONFIG.IRONSWORN.IronswornSettings.maybeSetGlobalSupply(value)
    },

    rollSupply() {
      CONFIG.IRONSWORN.RollDialog.show({
        actor: this.$actor,
        stat: 'supply',
      })
    },

    progressCompleted() {
      this.highlightCompleted = true
      clearTimeout(this.highlightCompletedTimer)
      this.highlightCompletedTimer = setTimeout(() => {
        this.highlightCompleted = false
      }, 2000)
    },

    saveNotes() {
      this.$actor.update({ 'data.biography': this.actor.data.biography })
    },
  },
}
</script>
