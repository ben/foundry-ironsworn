<template>
  <section class="condition-meter">
    <btn-actionroll
      class="resource-meter-title h4 vertical-v2"
      :actor="actor"
      :attr="attr"
      :tooltip="`Roll +${attr}`"
    />
    <resource-meter :id="`meter-${attr}`" :actor="actor" :attr="attr" :min="min" :max="max" />
  </section>
</template>

<style lang="less">
@import '../../../../styles/mixins.less';
@import '../../../../styles/fonts.less';
.condition-meter {
  .flexrow();
  flex-grow: 0;
  button.resource-meter-title {
    text-align: start;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: start;
    gap: 0.25em;
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    attr: String,
    min: Number,
    max: Number,
    i18nLabelKey: String,
    asset: Object,
  },
  methods: {
    rollStat() {
      CONFIG.IRONSWORN.RollDialog.show({ actor: this.$actor, stat: attr, asset })
    },
  },
}
</script>
