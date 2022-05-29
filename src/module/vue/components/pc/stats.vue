<template>
  <section class="stats">
    <attr-box :actor="actor" attr="edge"></attr-box>
    <attr-box :actor="actor" attr="heart"></attr-box>
    <attr-box :actor="actor" attr="iron"></attr-box>
    <attr-box :actor="actor" attr="shadow"></attr-box>
    <attr-box :actor="actor" attr="wits"></attr-box>
  </section>
</template>

<style lang="less">
@import '../../../../styles/mixins.less';
.stats {
  .flexrow();
  justify-content: space-around;
  .attr-box {
    flex: 0 0 75px;
  }
  .edit {
    flex: 0 0 30px;
    justify-items: center;
    align-items: center;
    border: 1px solid;
    transition: 0.5s ease;
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
  },
  methods: {
    rollStat(stat) {
      CONFIG.IRONSWORN.RollDialog.show({ actor: this.$actor, stat })
    },
  },
}
</script>
