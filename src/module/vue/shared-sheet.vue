<template>
  <article class="flexcol shared-sheet">
    <header class="sheet-header nogrow">
      <document-img :document="actor" />
      <document-name :document="actor" />
    </header>

    <section class="sheet-area nogrow">
      <h4 class="clickable text" @click="rollSupply">
        {{ $t('IRONSWORN.Supply') }}
      </h4>

      <boxrow style="line-height: 25px" :min="0" :max="5" :current="actor.data.supply" @click="setSupply" />
    </section>

    <section v-if="hasBonds" class="sheet-area nogrow">
      <bonds :actor="actor" />
    </section>

    <section class="sheet-area ironsworn__drop__target" data-drop-type="progress">
      <transition-group name="slide" tag="div" class="nogrow">
        <div class="flexrow nogrow" v-for="(item, i) in activeItems" :key="item._id">
          <order-buttons v-if="editMode" :i="i" :length="activeItems.length" @sortUp="sortUp" @sortDown="sortDown" />
          <progress-tracker :item="item" :actor="actor" challengeRankSvg="circle-pip" @completed="progressCompleted" />
        </div>
      </transition-group>

      <itemlist-controls :actor="actor" />
    </section>

    <section class="item-row nogrow" style="margin-top: 1rem">
      <h3 class="clickable text" :class="completedClass" @click="expandCompleted = !expandCompleted">
        <i :class="completedCaretClass"></i> {{ $t('IRONSWORN.Completed') }}
      </h3>
      <transition name="slide" tag="div" class="nogrow completed" style="margin: 0; padding: 0">
        <div v-if="expandCompleted">
          <transition-group name="slide" tag="div" class="nogrow">
            <div class="flexrow" v-for="(item, i) in completedItems" :key="item._id">
              <order-buttons
                v-if="editMode"
                :i="i"
                :length="completedItems.length"
                @sortUp="completedSortUp"
                @sortDown="completedSortDown"
              />
              <progress-tracker :item="item" challengeRankSvg="circle-pip" :actor="actor" :showStar="true" />
            </div>
          </transition-group>
        </div>
      </transition>
    </section>

    <textarea class="notes" :placeholder="$t('IRONSWORN.Notes')" v-model="actor.data.biography" @blur="saveNotes" />
  </article>
</template>

<style lang="less">
.shared-sheet {
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
      ].sort((a, b) => (a.sort || 0) - (b.sort || 0))
    },

    activeItems() {
      return this.progressItems.filter((x) => !x.data.completed)
    },
    completedItems() {
      return this.progressItems.filter((x) => x.data.completed)
    },

    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
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

    async applySort(oldI, newI, sortBefore, filterFn) {
      const foundryItems = this.$actor.items
        .filter((x) => x.type === 'progress')
        .filter((x) => x.data.data.subtype !== 'bond')
        .filter(filterFn)
        .sort((a, b) => (a.data.sort || 0) - (b.data.sort || 0))

      const updates = SortingHelpers.performIntegerSort(foundryItems[oldI], {
        target: foundryItems[newI],
        siblings: foundryItems,
        sortBefore,
      })
      await Promise.all(updates.map(({ target, update }) => target.update(update)))
    },

    sortUp(i, ...args) {
      this.applySort(i, i - 1, true, (x) => !x.data.data.completed)
    },
    sortDown(i) {
      this.applySort(i, i + 1, false, (x) => !x.data.data.completed)
    },
    completedSortUp(i) {
      this.applySort(i, i - 1, true, (x) => x.data.data.completed)
    },
    completedSortDown(i) {
      this.applySort(i, i + 1, false, (x) => x.data.data.completed)
    },
  },
}
</script>
