<!-- formerly "progress-box". renamed because "progress box" refers to a specific mechanical element in IS/SF (the boxes that comprise a progress track), so the name should be reserved for that. "progress-tracker" is more descriptive, and has a relationship to "progress-track"
-->
<template>
  <article class="progress-tracker" :class="classes">
    <document-img :document="item" size="38px" />
    <h1 class="progress-track-title">{{ item.name }}</h1>
    <span class="progress-track-type subtitle">{{ subtitle }}</span>
    <progress-track :ticks="item.data.current" v-if="item.data.hasTrack" />
    <clock
      v-if="item.data.hasClock"
      :size="50"
      :wedges="item.data.clockMax"
      :ticked="item.data.clockTicks"
      @click="setClock"
    />
    <!-- <challengerank-pips :svg="challengeRankSvg" :current="item.data.rank" @click="rankClick" /> -->
    <challenge-rank :pipSvg="challengeRankSvg" :item="item" :actor="actor" />
    <section class="progress-track-controls">
      <btn-faicon v-if="editMode" icon="trash" @click="destroy" :tooltip="$t('IRONSWORN.DeleteItem')" />
      <btn-faicon icon="edit" @click="edit" :tooltip="$t('IRONSWORN.Edit')" />
      <btn-faicon v-if="editMode" :icon="completedIcon" @click="toggleComplete" :tooltip="completedTooltip" />
      <btn-faicon
        v-if="editMode && item.data.hasTrack"
        icon="caret-left"
        @click="retreat"
        :tooltip="$t('IRONSWORN.UnmarkProgress')"
      />
      <btn-faicon
        v-if="item.data.hasTrack"
        icon="caret-right"
        @click="advance"
        :tooltip="$t('IRONSWORN.MarkProgress')"
      />
      <btn-isicon v-if="item.data.hasTrack" icon="d10-tilt" @click="fulfill" :tooltip="$t('IRONSWORN.ProgressRoll')" />
    </section>
    <btn-faicon
      class="btn-star"
      icon="star"
      :solid="item.data.starred"
      :tooltip="$t('IRONSWORN.StarProgress')"
      @click="toggleStar"
      v-if="showStar"
    />
  </article>
</template>

<style lang="less">
.progress-tracker {
  @iconSize: 1.5rem;
  display: grid;
  grid-template-columns: min-content (@iconSize*2) min-content 1fr @iconSize;
  grid-template-rows: @iconSize @iconSize 1fr;
  grid-auto-columns: min-content;
  grid-auto-flow: row;

  .progress-track-type {
    grid-column: 1;
    grid-row-end: span 3;
    grid-row-start: 1;
  }
  .doc-img {
    grid-column: 2;
    grid-row-start: 1;
    grid-row-end: span 2;
    align-self: center;
    margin-right: 0.25rem;
    background-color: var(--color-midtone);
    border-radius: 0.25rem;
  }
  .challenge-rank {
    grid-column: 3;
    grid-row: 1;
  }

  .btn-star {
    grid-row: 2;
    grid-column: 5;
    justify-self: end;
  }
  .progress-track-title {
    align-self: end;
    grid-row: 2;
    grid-column-start: 3;
    grid-column-end: span 2;
    font-size: var(--font-size-16);
    font-family: var(--font-compact);
    text-transform: none;
    letter-spacing: normal;
    word-spacing: normal;
    font-weight: 400;
  }
  .progress-track {
    grid-row: 3;
    grid-column-start: 2;
    grid-column-end: span 4;
    align-self: end;
    margin-top: 0.25rem;
  }
  .progress-track-controls {
    grid-row: 1;
    grid-column-start: 4;
    grid-column-end: span 2;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
  }
  .clock ~ .progress-track-controls {
    grid-column-start: 4;
    grid-column-end: span 3;
  }
  .progress-track-type,
  .progress-track-title {
    line-height: 1;
  }
  .clock {
    grid-row-start: 2;
    grid-row-end: span 2;
    flex-grow: 0;
    margin-left: 0.25rem;
    align-self: end;
    margin-right: -0.35rem;
    margin-bottom: -0.35rem;
    // & ~ .progress-track-controls {
    //   grid-column-start: 5;
    //   grid-column-end: span 3;
    // }
  }
}

.progress-tracker {
  .progress-track-type {
    writing-mode: vertical-lr;
    margin: 0;
    font-weight: normal;
    flex-grow: 0;
  }
  .doc-img {
    flex-grow: 0;
  }
  div.item-row {
    padding-left: 0;
  }
}
</style>

<script>
export default {
  props: {
    actor: { type: Object, required: true },
    item: { type: Object, required: true },
    showStar: Boolean,
    challengeRankSvg: Object,
  },

  computed: {
    classes() {
      if (this.item.data.hasClock) {
        return 'has-clock'
      }
      return ''
    },
    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
    },
    showTrackButtons() {
      return this.item.data.hasTrack
    },
    foundryItem() {
      const actor = game.actors?.get(this.actor._id)
      return actor?.items.get(this.item._id)
    },
    subtitle() {
      let subtype = this.$capitalize(this.item.data.subtype)
      if (subtype === 'Bond') subtype = 'Connection' // translate name
      return this.$t(`IRONSWORN.${subtype}`)
    },
    completedIcon() {
      return this.item.data.completed ? 'check-circle' : 'circle-notch'
    },
    completedTooltip() {
      const suffix = this.item.data.completed ? 'Completed' : 'NotCompleted'
      return this.$t('IRONSWORN.' + suffix)
    },
  },

  methods: {
    edit() {
      this.foundryItem.sheet.render(true)
    },
    destroy() {
      const item = this.foundryItem
      const titleKey = `IRONSWORN.Delete${this.$capitalize(item?.type || '')}`

      Dialog.confirm({
        title: $t(titleKey),
        content: `<p><strong>${$t('IRONSWORN.ConfirmDelete')}</strong></p>`,
        yes: () => item?.delete(),
        defaultYes: false,
      })
    },
    rankClick(rank) {
      this.foundryItem.update({ data: { rank } })
    },
    advance() {
      this.foundryItem.markProgress(1)
    },
    retreat() {
      this.foundryItem.markProgress(-1)
    },
    toggleComplete() {
      const completed = !this.item.data.completed
      if (completed) this.$emit('completed')
      this.$item.update({ data: { completed } })
    },
    toggleStar() {
      this.$item.update({ data: { starred: !this.item.data.starred } })
    },
    fulfill() {
      this.foundryItem.fulfill()
    },
    setClock(num) {
      this.$item.update({ data: { clockTicks: num } })
    },
  },
}
</script>
