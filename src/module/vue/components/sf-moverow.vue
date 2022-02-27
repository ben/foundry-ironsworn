<template>
  <div class="item-row">
    <h4 style="margin: 0">
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
