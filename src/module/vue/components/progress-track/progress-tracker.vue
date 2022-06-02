<!-- formerly "progress-box". renamed because "progress box" refers to a specific mechanical element in IS/SF (the boxes that comprise a progress track), so the name should be reserved for that. "progress-tracker" is more descriptive, and has a relationship to "progress-track"
-->
<template>
  <section class="progress-tracker item-row">
    <document-img :document="item" size="38px" />
    <span class="progress-track-title">{{ item.name }}</span>
    <span class="progress-track-type">{{ subtitle }}</span>
    <progress-track :ticks="item.data.current" v-if="item.data.hasTrack" />
    <clock
      v-if="item.data.hasClock"
      class="nogrow"
      :size="50"
      :wedges="item.data.clockMax"
      :ticked="item.data.clockTicks"
      @click="setClock"
    />
    <section class="progress-track-controls">
      <rank-hexes :current="item.data.rank" @click="rankClick" />
      <icon-button v-if="editMode" icon="trash" @click="destroy" :tooltip="$t('IRONSWORN.DeleteItem')" />
      <icon-button icon="edit" @click="edit" :tooltip="$t('IRONSWORN.Edit')" />
      <icon-button v-if="editMode" :icon="completedIcon" @click="toggleComplete" :tooltip="completedTooltip" />
      <icon-button
        v-if="editMode && item.data.hasTrack"
        icon="caret-left"
        @click="retreat"
        :tooltip="$t('IRONSWORN.UnmarkProgress')"
      />
      <icon-button
        v-if="item.data.hasTrack"
        icon="caret-right"
        @click="advance"
        :tooltip="$t('IRONSWORN.MarkProgress')"
      />
      <isicon-button
        v-if="item.data.hasTrack"
        icon="d10-tilt"
        @click="fulfill"
        :tooltip="$t('IRONSWORN.ProgressRoll')"
      />
      <icon-button
        class="btn-star"
        icon="star"
        :solid="item.data.starred"
        :tooltip="$t('IRONSWORN.StarProgress')"
        @click="toggleStar"
        v-if="showStar"
      />
    </section>
  </section>
</template>

<style lang="less">
.progress-tracker {
  display: grid;
  gap: 0.25em 0.5em;
  grid-template-columns: min-content max-content 1fr max-content;
  grid-template-rows: max-content max-content;
  grid-template-areas:
    'type img title controls'
    'type img track track';
}
.progress-track-title {
  grid-area: title;
}
.progress-track-type {
  grid-area: type;
}
.doc-img {
  grid-area: img;
}
.progress-track {
  grid-area: track;
}
.progress-track-controls {
  grid-area: controls;
  display: flex;
  flex-flow: row nowrap;
  justify-content: end;
  align-items: end;
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
  },

  computed: {
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
        title: game.i18n.localize(titleKey),
        content: `<p><strong>${game.i18n.localize('IRONSWORN.ConfirmDelete')}</strong></p>`,
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
