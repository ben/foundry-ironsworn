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

    <section
      class="sheet-area ironsworn__drop__target"
      data-drop-type="progress"
    >
      <transition-group name="slide" tag="div" class="nogrow">
        <progress-box
          v-for="item in progressItems"
          :key="item._id"
          :item="item"
          :actor="actor"
        />
      </transition-group>

      <progress-controls :actor="actor" />
    </section>
  </div>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: 83px;
  opacity: 1;
}
.slide-enter,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
  border-top: 0;
  border-bottom: 0;
}
</style>

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
  },
}
</script>
