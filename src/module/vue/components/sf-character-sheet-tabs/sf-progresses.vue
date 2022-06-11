<template>
  <itemlist-page class="progress-page">
    <transition-group
      name="slide"
      tag="foundryitem-list"
      class="progress-tracks ironsworn__drop__target"
      data-drop-type="progress"
    >
      <foundry-listitem class="item-progress" v-for="(item, i) in activeItems" :key="item._id">
        <order-buttons v-if="editMode" :i="i" :length="activeItems.length" @sortUp="sortUp" @sortDown="sortDown" />
        <progress-tracker
          challengeRankSvg="hex-pip"
          :item="item"
          :actor="actor"
          :showStar="true"
          @completed="progressCompleted"
        />
      </foundry-listitem>
    </transition-group>

    <itemlist-controls :actor="actor" :compendiumTypes="[{ name: 'starforgedencounters', i18n: 'Foes' }]" />
    <!-- TODO: rebuild with a dedicated component for collapsible elements -->

    <expandable
      wrapperTag="section"
      transitionGroupTag="ul"
      :baseId="`progress-completed-${actor._id}`"
      :buttonText="$t('IRONSWORN.Completed')"
      class="progress-completed"
      transitionGroupClasses="progress-tracks foundry-item-list"
    >
      <foundry-listitem class="item-progress" v-for="(item, i) in completedItems" :key="item._id">
        <order-buttons
          v-if="editMode"
          :i="i"
          :length="completedItems.length"
          @sortUp="completedSortUp"
          @sortDown="completedSortDown"
        />
        <progress-tracker challengeRankSvg="hex-pip" :item="item" :actor="actor" :showStar="true" />
      </foundry-listitem>
    </expandable>
  </itemlist-page>
</template>

<style lang="less">
.progress-tracks {
  .foundry-item {
    padding: 0.25rem 0.5rem 0.5rem 0.125rem;
  }
}
.progress-page {
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5em;

  .progress-completed {
    justify-content: stretch;
    display: flex;
    flex-flow: column nowrap;
    gap: 0.5em;
    button.expand-toggle {
      justify-content: center;
    }
    ul.expand-content {
    }
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

    completedCaret() {
      return `caret-${this.expandCompleted ? 'down' : 'right'}`
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
      await Promise.all(updates.map(({ target, update }) => target.update(update)))
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
