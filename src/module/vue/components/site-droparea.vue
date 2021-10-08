<template>
  <div class="flexcol box ironsworn__drop__target" :data-drop-type="itemType">
    <div v-if="item" style="padding: 1em; position: relative">
      <div class="flexrow">
        <img
          class="profile-img nogrow"
          :src="item.img"
          :title="item.name"
          height="38"
          style="margin-right: 5px"
        />

        <div class="flexcol">
          <h4 style="margin: 0">{{ item.name }}</h4>
          <p>{{ item.data.summary }}</p>
        </div>

        <div
          class="flexrow"
          v-if="editMode"
          style="position: absolute; right: 5px; top: 5px"
        >
          <icon-button icon="trash" @click="destroy" />
          <icon-button icon="edit" @click="edit" />
        </div>
      </div>
    </div>

    <div v-else style="padding: 1em; width: 100%">
      <div class="flexcol">
        <h4 style="margin: 0">{{ $t(titleKey) }}</h4>
        <p
          class="inset clickable block"
          style="padding: 0 2em"
          @click="openCompendium"
        >
          <i class="fas fa-atlas"></i>
          {{ $t('IRONSWORN.OpenCompendium') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
    item: Object,
    itemType: String,
    titleKey: String,
    compendiumKey: String,
  },

  computed: {
    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
    },

    ironswornActor() {
      return game.actors?.get(this.actor._id)
    },

    ironswornItem() {
      return this.ironswornActor.items.get(this.item._id)
    },
  },

  methods: {
    destroy() {
      const titleKey = 'IRONSWORN.DeleteItem'

      Dialog.confirm({
        title: game.i18n.localize(titleKey),
        content: `<p><strong>${game.i18n.localize(
          'IRONSWORN.ConfirmDelete'
        )}</strong></p>`,
        yes: () => this.ironswornItem?.delete(),
        defaultYes: false,
      })
    },

    edit() {
      this.ironswornItem.sheet.render(true)
    },

    openCompendium() {
      const pack = game.packs.get(`foundry-ironsworn.${this.compendiumKey}`)
      pack?.render(true)
    },
  },
}
</script>
