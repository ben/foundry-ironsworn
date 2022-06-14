<template>
  <section class="site-drop-area flexcol box ironsworn__drop__target" :data-drop-type="itemType">
    <div v-if="item" class="v-if-item">
      <div class="flexrow">
        <document-img :document="item" size="38px" class="nogrow" style="margin-right: 5px" />

        <div class="flexcol">
          <h4 style="margin: 0">{{ item.name }}</h4>
          <p>{{ item.data.summary }}</p>
        </div>

        <div class="flexrow" v-if="editMode" style="position: absolute; right: 5px; top: 5px">
          <faicon-button icon="trash" @click="destroy" />
          <faicon-button icon="edit" @click="edit" />
        </div>
      </div>
    </div>

    <div v-else class="v-else-item">
      <div class="flexcol">
        <h4 style="margin: 0">{{ $t(titleKey) }}</h4>

        <btn-compendium :compendium="`foundry-ironsworn.${this.compendiumKey}`">
          {{ $t('IRONSWORN.OpenCompendium') }}</btn-compendium
        >
      </div>
    </div>
  </section>
</template>

<style lang="less">
.site-drop-area {
  .btn-compendium {
    padding: 0 2em;
    // also inset???
  }
  // TODO: replace these class names with something more representative, after determining wtf these are supposed to represent
  .v-if-item {
    padding: 1em;
    position: relative;
  }
  .v-else-item {
    padding: 1em;
    width: 100%;
  }
}
</style>

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
  },

  methods: {
    destroy() {
      const titleKey = 'IRONSWORN.DeleteItem'

      Dialog.confirm({
        title: game.i18n.localize(titleKey),
        content: `<p><strong>${game.i18n.localize('IRONSWORN.ConfirmDelete')}</strong></p>`,
        yes: () => this.$item?.delete(),
        defaultYes: false,
      })
    },

    edit() {
      this.$item.sheet.render(true)
    },

    openCompendium() {
      const pack = game.packs.get(`foundry-ironsworn.${this.compendiumKey}`)
      pack?.render(true)
    },
  },
}
</script>
