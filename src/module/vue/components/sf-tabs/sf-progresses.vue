<template>
  <div
    class="flexcol sheet-area ironsworn__drop__target"
    data-drop-type="progress"
  >
    <transition-group name="slide" tag="div" class="nogrow">
      <progress-box
        v-for="item in progressItems"
        :key="item._id"
        :item="item"
        :actor="actor"
        :showStar="true"
      />
    </transition-group>

    <progress-controls :actor="actor" />
  </div>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
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
    progressItems() {
      return this.actor.items.filter((x) => x.type === 'progress')
    },
  },
}
</script>
