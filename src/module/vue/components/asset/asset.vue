<template>
  <div class="item-row ironsworn__asset nogrow">
    <div class="asset-entry" @click="toggle">
      <div class="flexrow">
        <h4 style="margin: 0; line-height: 20px">{{ asset.name }}</h4>
        <icon-button v-if="editMode" icon="trash" @click="destroy" />
        <icon-button icon="edit" @click="edit" />
      </div>
    </div>
    <transition name="slide">
      <div class="flexcol asset-summary" v-if="expanded">
        <p v-for="(field, i) in asset.data.fields" :key="'field' + i">
          <strong>{{ field.name }}:</strong> {{ field.value }}
        </p>

        <with-rolllisteners
          element="p"
          :actor="actor"
          v-if="asset.data.description"
          @moveclick="moveclick"
        >
          <div v-html="$enrichHtml(asset.data.description)"></div>
        </with-rolllisteners>

        <ul>
          <with-rolllisteners
            v-for="(ability, i) in enabledAbilities"
            :key="'ability' + i"
            element="li"
            :actor="actor"
            @moveclick="moveclick"
          >
            <div v-html="$enrichHtml(ability.description)"></div>
          </with-rolllisteners>
        </ul>

        <div class="flexcol" v-if="asset.data.track.enabled">
          <h4
            class="clickable text"
            style="margin-bottom: 3px"
            @click="rollTrack"
          >
            {{ asset.data.track.name }}
          </h4>
          <asset-track :actor="actor" :item="asset" />
        </div>

        <div
          class="flexcol stack nogrow"
          style="margin-top: 5px"
          v-if="asset.data.exclusiveOptions.length > 0"
        >
          <asset-exclusiveoption
            v-for="(opt, i) in asset.data.exclusiveOptions"
            :key="'option' + i"
            :opt="opt"
            @click="exclusiveOptionClick(i)"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
  max-height: 250px;
}
.slide-enter,
.slide-leave-to {
  max-height: 0;
}
</style>

<script>
export default {
  props: {
    actor: Object,
    asset: Object,
  },

  computed: {
    expanded() {
      return this.asset?.flags['foundry-ironsworn']?.expanded || false
    },
    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
    },
    enabledAbilities() {
      const abilities = Object.values(this.asset.data.abilities)
      return abilities.filter((x) => x.enabled)
    },
    foundryActor() {
      return game.actors?.get(this.actor._id)
    },
    foundryItem() {
      return this.foundryActor?.items.get(this.asset._id)
    },
  },

  methods: {
    toggle() {
      this.foundryItem?.setFlag(
        'foundry-ironsworn',
        'expanded',
        !this.asset?.flags['foundry-ironsworn']?.expanded
      )
    },
    edit(ev) {
      ev.stopPropagation()
      this.foundryItem.sheet.render(true)
      return false
    },
    destroy(ev) {
      ev.stopPropagation()

      Dialog.confirm({
        title: this.$t('IRONSWORN.DeleteAsset'),
        content: `<p><strong>${this.$t(
          'IRONSWORN.ConfirmDelete'
        )}</strong></p>`,
        yes: () => this.foundryItem?.delete(),
        defaultYes: false,
      })
    },
    rollTrack() {
      CONFIG.IRONSWORN.RollDialog.show({
        actor: this.foundryActor,
        asset: this.foundryItem,
        stat: 'track',
      })
    },
    exclusiveOptionClick(selectedIdx) {
      const options = this.asset.data.exclusiveOptions
      for (let i = 0; i < options.length; i++) {
        options[i].selected = i === selectedIdx
      }
      this.foundryItem.update({ data: { exclusiveOptions: options } })
    },
    moveclick(item) {
      this.$actor?.moveSheet?.highlightMove(item)
    }
  },
}
</script>
