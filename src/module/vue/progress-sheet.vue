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

    <!-- PROGRESS -->
    <div class="flexrow track nogrow" style="margin-bottom: 1em">
      <progress-track :ticks="item.data.current" />
    </div>

    <!-- DESCRIPTION -->
    <editor
      :owner="owner"
      target="data.description"
      button="true"
      editable="true"
      :content="item.data.description"
    />
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

    clearProgress() {
      this.ironswornItem.update({ 'data.current': 0 })
    },

    markProgress() {
      const increment = CONFIG.IRONSWORN.RankIncrements[this.item.data.rank]
      const newValue = Math.min(this.item.data.current + increment, 40)
      this.ironswornItem.update({ 'data.current': newValue })
    },
  },
}
</script>
