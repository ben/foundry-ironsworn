<template>
  <div class="flexrow item-row nogrow">
    <h5 class="vertical-v2 nogrow">{{ subtitle }}</h5>
    <div class="flexcol">
      <div class="flexrow">
        <document-img
          :document="item"
          :size="38"
          class="nogrow"
          style="margin-right: 5px"
        />
        <div class="flexcol">
          <div class="flexrow">
            <rank-hexes :current="item.data.rank" @click="rankClick" />
            <icon-button v-if="editMode" icon="trash" @click="destroy" />
            <icon-button icon="edit" @click="edit" />
            <icon-button icon="play" @click="advance" />
            <icon-button icon="dice-d6" @click="fulfill" />
          </div>
          <h4 class="flexrow">
            <span>{{ item.name }}</span>
            <icon-button
              icon="star"
              :solid="item.data.starred"
              :tooltip="$t('IRONSWORN.StarProgress')"
              @click="toggleStar"
              v-if="showStar"
            />
          </h4>
        </div>
      </div>
      <div class="flexrow">
        <div class="flexrow track">
          <progress-track :ticks="item.data.current" />
        </div>
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
    foundryItem() {
      const actor = game.actors?.get(this.actor._id)
      return actor?.items.get(this.item._id)
    },
    subtitle() {
      return this.$t(`IRONSWORN.${this.$capitalize(this.item.data.subtype)}`)
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
      this.foundryItem.markProgress()
    },
    toggleStar() {
      this.$item.update({ data: { starred: !this.item.data.starred } })
    },
    fulfill() {
      this.foundryItem.fulfill()
    },
  },
}
</script>
