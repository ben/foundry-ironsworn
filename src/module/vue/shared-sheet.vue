<template>
  <div class="flexcol">
    <header class="sheet-header">
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

    <section class="sheet-area">
      <h2 class="clickable text nogrow">
        {{ $t('IRONSWORN.Supply') }}
      </h2>

      <boxrow
        class="nogrow"
        style="line-height: 25px"
        :min="0"
        :max="5"
        :current="actor.data.supply"
        @click="supplyClick"
      />
    </section>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
  },

  computed: {
    supplyItems() {
      const current = this.actor.data.supply
      return [
        { text: '0', value: 0, selected: current === 0 },
        { text: '1', value: 1, selected: current === 1 },
        { text: '2', value: 2, selected: current === 2 },
        { text: '3', value: 3, selected: current === 3 },
        { text: '4', value: 4, selected: current === 4 },
        { text: '5', value: 5, selected: current === 5 },
      ]
    },

    ironswornActor() {
      return game.actors?.get(this.actor._id)
    },
  },

  methods: {
    supplyClick(_ev, value) {
      this.ironswornActor.update({ data: { supply: value } })
      CONFIG.IRONSWORN.IronswornSettings.maybeSetGlobalSupply(value) }
  },
}
</script>
