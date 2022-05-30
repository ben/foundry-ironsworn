<template>
  <condition-meter class="asset-track" :actor="actor" attr="track" min="0" :max="item.data.track.max" :item="item">
    {{ item.data.track.name }}
  </condition-meter>
</template>

<style lang="less">
@import '../../../../styles/mixins.less';
.asset-track {
  &.condition-meter {
    .flexcol();
    button {
      display: flex;
      gap: 5px;
      justify-content: start;
      min-width: unset;
      width: unset;
    }
    .resource-meter {
      .flexrow();
      flex-direction: row-reverse;
    }
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    item: Object,
  },
}
</script>
