<template>
  <div class="item-row flexcol ironsworn__asset">
    <div class="asset-entry nogrow" @click="toggle">
      <div class="flexrow">
        <h4 style="margin: 0; line-height: 20px">{{ asset.name }}</h4>
        <btn-faicon v-if="editMode" icon="trash" @click="destroy" />
        <btn-faicon icon="edit" @click="edit" />
      </div>
    </div>
    <transition name="slide">
      <div class="flexcol asset-summary" v-if="expanded">
        <p v-for="(field, i) in asset.data.fields" :key="'field' + i">
          <strong>{{ field.name }}:</strong> {{ field.value }}
        </p>

        <ul>
          <with-rolllisteners
            v-for="(ability, i) in enabledAbilities"
            :key="'ability' + i"
            element="li"
            class="flexrow"
            :actor="actingActor"
            @moveclick="moveclick"
          >
            <i class="fas fa-circle nogrow" style="margin: 1rem 0.5rem 0 0"></i>
            <div v-html="$enrichHtml(ability.description)"></div>
            <clock
              v-if="ability.hasClock"
              class="nogrow"
              style="flex-basis: 100px"
              :wedges="ability.clockMax"
              :ticked="ability.clockTicks"
              @click="setAbilityClock(i, $event)"
            />
          </with-rolllisteners>
        </ul>

        <div class="flexcol" v-if="asset.data.track.enabled">
          <h4 class="clickable text flexrow" style="margin-bottom: 3px" @click="rollTrack">
            <span>{{ asset.data.track.name }}</span>
            <i class="isicon-d10-tilt juicy nogrow" style="padding-right: 3px"></i>
          </h4>
          <asset-track :actor="actor" :item="asset" />
        </div>

        <div class="flexcol stack nogrow" style="margin-top: 5px" v-if="asset.data.exclusiveOptions.length > 0">
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
  max-height: 350px;
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
    actingActor() {
      if (this.actor.type === 'character') return this.actor
      return CONFIG.IRONSWORN.defaultActor()?.toObject(false)
    },
  },

  methods: {
    toggle() {
      this.foundryItem?.setFlag('foundry-ironsworn', 'expanded', !this.asset?.flags['foundry-ironsworn']?.expanded)
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
        content: `<p><strong>${this.$t('IRONSWORN.ConfirmDelete')}</strong></p>`,
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
      let actorWithMoves = this.$actor
      if (this.$actor?.type !== 'character') {
        actorWithMoves = CONFIG.IRONSWORN.defaultActor()
      }
      actorWithMoves?.moveSheet?.render(true)
      actorWithMoves?.moveSheet?.highlightMove(item)
    },

    setAbilityClock(abilityIdx, clockTicks) {
      const abilities = Object.values(this.asset.data.abilities)
      abilities[abilityIdx] = { ...abilities[abilityIdx], clockTicks }
      this.foundryItem.update({ data: { abilities } })
    },
  },
}
</script>
