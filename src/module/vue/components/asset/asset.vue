<template>
  <div class="item-row ironsworn__asset">
    <div class="asset-entry" @click="toggle">
      <div class="flexrow">
        <h4 style="margin: 0; line-height: 20px">{{ asset.name }}</h4>
        <icon-button v-if="editMode" icon="trash" @click="destroy" />
        <icon-button icon="edit" @click="edit" />
      </div>
    </div>
    <div class="flexcol asset-summary" :class="collapsedClass">
      <p v-for="(field, i) in asset.data.fields" :key="i">
        <strong>{{ field.name }}:</strong> {{ field.value }}
      </p>

      <p
        v-if="asset.data.description"
        v-html="$enrichHtml(asset.data.description)"
      />

      <ul>
        <li
          v-for="(ability, i) in enabledAbilities"
          :key="i"
          v-html="$enrichHtml(ability.description)"
        ></li>
      </ul>

      <div class="flexcol" v-if="asset.data.track.enabled">
        <h4
          class="clickable text"
          style="margin-bottom: 3px"
          @click="rollTrack"
        >
          {{ asset.data.track.name }}
        </h4>
        <asset-track :actor="actor" :asset="asset" />
      </div>

      <div
        class="flexcol stack nogrow"
        style="margin-top: 5px"
        v-if="asset.data.exclusiveOptions.length > 0"
      >
        <asset-exclusiveoption
          v-for="(opt, i) in asset.data.exclusiveOptions"
          :key="i"
          :opt="opt"
          @click="exclusiveOptionClick(i)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
    asset: Object,
  },

  computed: {
    collapsedClass() {
      return {
        collapsed: this.asset.flags['foundry-ironsworn']['expanded'],
      }
    },
    editMode() {
      return this.actor.flags['foundry-ironsworn']['edit-mode']
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
        !this.foundryItem.getFlag('foundry-ironsworn', 'expanded')
      )
    },
    edit(ev) {
      ev.stopPropagation()
      this.foundryItem.sheet.render(true)
      return false
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
  },
}
</script>
