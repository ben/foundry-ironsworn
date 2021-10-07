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
    ironswornActor() {
      return game.actors?.get(this.actor._id)
    },
  },

  methods: {
    supplyClick(_ev, value) {
      this.ironswornActor.update({ data: { supply: value } })
      CONFIG.IRONSWORN.IronswornSettings.maybeSetGlobalSupply(value)
    },
  },
}
</script>
