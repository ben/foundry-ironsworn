<template>
  <div class="flexrow item-row">
    <h5 class="vertical-v2 nogrow">{{ subtitle }}</h5>
    <div class="flexcol">
      <div class="flexrow">
        <document-img
          :document="item"
          size="38px"
          class="nogrow"
          style="margin-right: 5px"
        />
        <div class="flexcol">
          <div class="flexrow">
            <rank-hexes :current="item.data.rank" @click="rankClick" />
            <btn-faicon
              class="block"
              v-if="editMode"
              icon="trash"
              @click="destroy"
              :tooltip="$t('IRONSWORN.DeleteItem')"
            />
            <btn-faicon
              class="block"
              icon="edit"
              @click="edit"
              :tooltip="$t('IRONSWORN.Edit')"
            />
            <btn-faicon
              class="block"
              v-if="editMode"
              :icon="completedIcon"
              @click="toggleComplete"
              :tooltip="completedTooltip"
            />
            <btn-faicon
              class="block"
              v-if="editMode && item.data.hasTrack"
              icon="caret-left"
              @click="retreat"
              :tooltip="$t('IRONSWORN.UnmarkProgress')"
            />
            <btn-faicon
              class="block"
              v-if="item.data.hasTrack"
              icon="caret-right"
              @click="advance"
              :tooltip="$t('IRONSWORN.MarkProgress')"
            />
            <btn-rollprogress
              v-if="item.data.hasTrack"
              :tooltip="$t('IRONSWORN.ProgressRoll')"
              class="flexrow nogrow block"
              style="padding: 3px"
            />
          </div>
          <h4 class="flexrow">
            <span>{{ item.name }}</span>
            <btn-faicon
              class="block"
              icon="star"
              :solid="item.data.starred"
              :tooltip="$t('IRONSWORN.StarProgress')"
              @click="toggleStar"
              v-if="showStar"
            />
          </h4>
        </div>
      </div>
      <div class="flexrow" style="justify-content: center">
        <progress-track :ticks="item.data.current" v-if="item.data.hasTrack" />
        <clock
          v-if="item.data.hasClock"
          class="nogrow"
          style="flex-basis: 50px; margin: 0 0.5rem"
          :size="50"
          :wedges="item.data.clockMax"
          :ticked="item.data.clockTicks"
          @click="setClock"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
div.item-row {
  padding-left: 0;
}
h5.vertical-v2 {
  padding-right: 2px;
  margin: 0;
  font-weight: normal;
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
        content: `<p><strong>${game.i18n.localize(
          'IRONSWORN.ConfirmDelete'
        )}</strong></p>`,
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
    setClock(num) {
      this.$item.update({ data: { clockTicks: num } })
    },
  },
}
</script>
