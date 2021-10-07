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

    <div class="flexrow">
      <rank-hexes :current="actor.data.rank" @click="setRank" />
    </div>
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
    }
  },

  methods: {
    setRank(rank) {
      this.ironswornActor.update({data: {rank}})
    },
  },
}
</script>
