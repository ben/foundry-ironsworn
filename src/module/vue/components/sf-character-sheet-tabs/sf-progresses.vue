<template>
  <div class="flexcol progress-tracks">
    <div class="flexcol ironsworn__drop__target" data-drop-type="progress">
      <transition-group name="slide" tag="div" class="nogrow">
        <div
          class="flexrow nogrow"
          v-for="(item, i) in activeItems"
          :key="item._id"
        >
          <order-buttons
            v-if="editMode"
            :i="i"
            :length="activeItems.length"
            @sortUp="sortUp"
            @sortDown="sortDown"
          />
          <progress-box
            :item="item"
            :actor="actor"
            :showStar="true"
            @completed="progressCompleted"
          />
        </div>
      </transition-group>
      <progress-controls :actor="actor" foeCompendium="starforgedencounters" />
    </div>

    <div class="item-row nogrow progress-tracker">
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
      >
        <div v-if="expandCompleted">
          <transition-group name="slide" tag="div" class="nogrow">
            <div
              class="flexrow"
              v-for="(item, i) in completedItems"
              :key="item._id"
            >
              <order-buttons
                v-if="editMode"
                :i="i"
                :length="completedItems.length"
                @sortUp="completedSortUp"
                @sortDown="completedSortDown"
              />
              <progress-box :item="item" :actor="actor" :showStar="true" />
            </div>
          </transition-group>
        </div>
      </transition>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    actor: Object,
  },

  data() {
    return {
      expandCompleted: false,
      highlightCompleted: false,
      highlightCompletedTimer: null,
    }
  },

  computed: {
    progressItems() {
      return this.actor.items
        .filter((x) => x.type === 'progress')
        .filter((x) => x.data.subtype !== 'bond')
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
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
  },

  methods: {
    progressCompleted() {
      this.highlightCompleted = true
      clearTimeout(this.highlightCompletedTimer)
      this.highlightCompletedTimer = setTimeout(() => {
        this.highlightCompleted = false
      }, 2000)
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
      await Promise.all(
        updates.map(({ target, update }) => target.update(update))
      )
    },

    sortUp(i) {
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
