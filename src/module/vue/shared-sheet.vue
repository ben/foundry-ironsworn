<template>
  <div class="flexcol">
    <header class="sheet-header nogrow">
      <img
        :src="actor.img"
        :title="actor.name"
        class="profile-img"
        data-edit="img"
        height="50"
        width="50"
      />
      <h1 class="charname">
        <input
          :placeholder="$t('IRONSWORN.Name')"
          v-model="actor.name"
          name="name"
          type="text"
        />
      </h1>
    </header>

    <section class="sheet-area nogrow">
      <h4 class="clickable text" @click="rollSupply">
        {{ $t('IRONSWORN.Supply') }}
      </h4>

      <boxrow
        style="line-height: 25px"
        :min="0"
        :max="5"
        :current="actor.data.supply"
        @click="setSupply"
      />
    </section>

    <section class="sheet-area nogrow">
      <bonds :actor="actor" />
    </section>

    <section class="sheet-area ironsworn__drop__target" data-drop-type="progress">
      <progress-box
        v-for="item in progressItems"
        :key="item._id"
        :item="item"
        :actor="actor"
      />

      <div class="flexrow nogrow" style="text-align: center">
        <div class="clickable block" @click="addProgressItem('vow')">
          <i class="fas fa-plus"></i>
          {{ $t('IRONSWORN.Vow') }}
        </div>
        <div class="clickable block" @click="addProgressItem('progress')">
          <i class="fas fa-plus"></i>
          {{ $t('IRONSWORN.Progress') }}
        </div>
        <div class="clickable block" @click="openCompendium('ironswornfoes')">
          <i class="fas fa-atlas"></i>
          {{ $t('IRONSWORN.Foes') }}
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
  },

  computed: {
    ironswornActor() {
      return game.actors?.get(this.actor._id)
    },

    progressItems() {
      return [
        ...this.actor.items.filter((x) => x.type === 'vow'),
        ...this.actor.items.filter((x) => x.type === 'progress'),
      ]
    },
  },

  methods: {
    setSupply(_ev, value) {
      this.ironswornActor.update({ data: { supply: value } })
      CONFIG.IRONSWORN.IronswornSettings.maybeSetGlobalSupply(value)
    },

    rollSupply() {
      CONFIG.IRONSWORN.RollDialog.show({
        actor: this.ironswornActor,
        stat: 'supply',
      })
    },

    async addProgressItem(type) {
      const itemData = {
        name: this.$capitalize(type),
        type,
        sort: 9000000,
      }
      const item = await Item.create(itemData, { parent: this.ironswornActor })
      item.sheet.render(true)
    },

    openCompendium(name) {
      const pack = game.packs?.get(`foundry-ironsworn.${name}`)
      pack?.render(true)
    },
  },
}
</script>
