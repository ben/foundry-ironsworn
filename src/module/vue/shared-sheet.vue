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
  },
}
</script>
