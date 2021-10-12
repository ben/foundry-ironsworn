<template>
  <div class="flexcol">
    <!-- HEADER -->
    <header class="sheet-header nogrow">
      <img
        :src="item.img"
        :title="item.name"
        class="profile-img"
        data-edit="img"
        height="50"
        width="50"
      />
      <h1 class="charname">
        <input
          :placeholder="$t('IRONSWORN.Name')"
          v-model="item.name"
          name="name"
          type="text"
        />
      </h1>
    </header>

    <!-- RANK -->
    <div class="flexrow nogrow">
      <rank-hexes
        :current="item.data.rank"
        @click="setRank"
        class="nogrow"
        style="margin-right: 1em"
      />
      <h4>{{ rankText }}</h4>
      <icon-button v-if="editMode" icon="trash" @click="clearProgress" />
      <icon-button icon="play" @click="markProgress" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },

  computed: {
    ironswornItem() {
      if (this.item.parent) {
        const actor = game.actors?.get(this.item.parent._id)
        return actor?.items.get(this.item._id)
      }
      return game.items?.get(this.item._id)
    },

    editMode() {
      return this.item.flags['foundry-ironsworn']?.['edit-mode']
    },

    rankText() {
      return this.$t(CONFIG.IRONSWORN.Ranks[this.item.data.rank])
    },
  },

  methods: {
    setRank(rank) {
      this.ironswornItem.update({ data: { rank } })
    },
  },
}
</script>
