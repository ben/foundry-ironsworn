<template>
  <section class="condition-meter">
    <btn-actionroll
      v-if="!embedButtonInBar"
      class="resource-meter-title h4"
      :actor="actor"
      :attr="attr"
      :tooltip="tooltip"
      :item="item"
      :id="`button-${conditionMeterId}`"
    >
      <slot></slot>
    </btn-actionroll>
    <resource-meter
      :actor="actor"
      :item="item"
      :attr="attr"
      :min="min"
      :max="max"
      :current="current"
      :id="conditionMeterId"
      :aria-labelledby="`button-${conditionMeterId}`"
    >
      <btn-actionroll
        v-if="embedButtonInBar"
        :tooltip="tooltip"
        class="resource-meter-title h4"
        :actor="actor"
        :attr="attr"
        :item="item"
        :id="`button-${conditionMeterId}`"
      >
        <slot></slot>
      </btn-actionroll>
    </resource-meter>
  </section>
</template>

<style lang="less">
// @import '../../../../styles/mixins.less';
.condition-meter {
}
</style>

<script>
export default {
  props: {
    embedButtonInBar: {
      type: Boolean,
      default: false,
    },
    actor: Object,
    attr: String,
    item: Object, // optional. if present, the item's attribute will be used instead of the actor's
    min: Number,
    max: Number,
    tooltip: String,
    current: Number,
  },
  computed: {
    conditionMeterId() {
      if (this.item) {
        return `meter-${this.item._id}-${this.actor._id}`
      } else {
        // TODO: figure out how to get actor id??
        return `meter-${this.attr}-${this.actor._id}`
      }
    },
  },
}
</script>
