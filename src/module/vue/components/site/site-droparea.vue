<template>
  <div class="flexcol box ironsworn__drop__target" :data-drop-type="itemType">
    <div v-if="item" style="padding: 1em; position: relative">
      <div class="flexrow">
        <document-img
          :document="item"
          size="38px"
          class="nogrow"
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
          <btn-faicon icon="trash" @click="destroy" />
          <btn-faicon icon="edit" @click="edit" />
        </div>
      </div>
    </div>

    <div v-else style="padding: 1em; width: 100%">
      <div class="flexcol">
        <h4 style="margin: 0">{{ $t(titleKey) }}</h4>
        <btn-compendium
          :compendium="compendiumKey"
          style="padding: 0 2em"
          class="inset block"
          >{{ $t('IRONSWORN.OpenCompendium') }}</btn-compendium
        >
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
  },

  methods: {
    destroy() {
      const titleKey = 'IRONSWORN.DeleteItem'

      Dialog.confirm({
        title: game.i18n.localize(titleKey),
        content: `<p><strong>${game.i18n.localize(
          'IRONSWORN.ConfirmDelete'
        )}</strong></p>`,
        yes: () => this.$item?.delete(),
        defaultYes: false,
      })
    },

    edit() {
      this.$item.sheet.render(true)
    },
  },
}
</script>
