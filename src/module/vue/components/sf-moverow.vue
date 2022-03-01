<template>
  <div class="item-row">
    <h4 style="margin: 0" :title="tooltip">
      <i class="fa fa-dice-d6 clickable text" @click="rollMove" />
      {{ move.Name }}
    </h4>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
    move: Object,
  },

  computed: {
    tooltip() {
      // TODO: page number, when it shows up
      return this.move.Source?.Title
    }
  },

  methods: {
    async rollMove() {
      CONFIG.IRONSWORN.RollDialog.show({
        actor: this.$actor,
        move: this.move.foundryItem.getMoveData(),
      })
    },
  },
}
</script>
