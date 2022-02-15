<template>
  <div class="flexcol">
    <transition-group name="slide" tag="div" class="nogrow">
      <progress-box
        v-for="item in bonds"
        :key="item._id"
        :item="item"
        :actor="actor"
        :showStar="true"
      />
    </transition-group>
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
    bonds() {
      return this.actor.items
        .filter((x) => x.type === 'progress')
        .filter((x) => x.data.subtype === 'bond')
    },
  },
}
</script>
