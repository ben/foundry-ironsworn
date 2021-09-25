<template>
  <div class="flexrow item-row nogrow" >
    <h4 class="vertical-v2 nogrow">{{ subtitle }}</h4>
    <div class="flexcol">
      <div class="flexrow">
        <img
          class="profile-img nogrow"
          :src="item.img"
          :title="item.name"
          height="38"
          style="margin-right: 5px"
        />
        <div class="flexcol">
          <div class="flexrow">
            <rank-hexes :item="item" :actor="actor" />
            <icon-button v-if="editMode" icon="trash" @click="destroy" />
            <icon-button icon="edit" @click="edit" />
            <icon-button icon="play" @click="advance" />
            <icon-button icon="dice-d6" @click="fulfill" />
          </div>
          <h4>{{ item.name }}</h4>
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
h4 {
  padding-right: 2px;
}
</style>

<script>
export default {
  props: {
    actor: { type: Object, required: true },
    item: { type: Object, required: true },
  },

  computed: {
    editMode() {
      return this.actor.flags['foundry-ironsworn']['edit-mode']
    },
    foundryItem() {
      const actor = game.actors?.get(this.actor._id)
      return actor?.items.get(this.item._id)
    },
    subtitle() {
      return this.$t(`IRONSWORN.${this.$capitalize(this.item.type)}`)
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
    advance() {
      this.foundryItem.markProgress()
    },
    fulfill() {
      this.foundryItem.fulfill()
    },
  },
}
</script>
