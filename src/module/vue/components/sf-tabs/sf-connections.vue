<template>
  <div class="flexcol">
    <transition-group name="slide" tag="div" class="nogrow">
      <progress-box
        v-for="item in connections"
        :key="item._id"
        :item="item"
        :actor="actor"
        :showStar="true"
      />
    </transition-group>

    <div class="flexrow nogrow" style="text-align: center">
      <div class="clickable block" @click="newConnection">
        <i class="fas fa-plus"></i>
        {{ $t('IRONSWORN.Bond') }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  max-height: 83px;
}
</style>

<script>
export default {
  props: {
    actor: Object,
  },

  computed: {
    connections() {
      return this.actor.items
        .filter((x) => x.type === 'progress')
        .filter((x) => x.data.subtype === 'bond') // legacy name
    },
  },

  methods: {
    async newConnection() {
      const item = await Item.create(
        {
          name: game.i18n.localize('IRONSWORN.Connection'),
          type: 'progress',
          data: { subtype: 'bond' }, // legacy name
          sort: 9000000,
        },
        { parent: this.$actor }
      )
      item.sheet.render(true)
    },
  },
}
</script>
