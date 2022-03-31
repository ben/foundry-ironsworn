<template>
  <div class="flexcol">
    <div class="flexcol ironsworn__drop__target" data-drop-type="progress">
      <transition-group name="slide" tag="div" class="nogrow">
        <progress-box
          v-for="item in activeItems"
          :key="item._id"
          :item="item"
          :actor="actor"
          :showStar="true"
        />
      </transition-group>
      <progress-controls :actor="actor" />
    </div>

    <div class="item-row nogrow">
      <h3 class="clickable text" @click="expandCompleted = !expandCompleted">
        <i :class="completedCaretClass"></i> {{ $t('IRONSWORN.Completed') }}
      </h3>
      <transition name="completed-slide" tag="div" class="nogrow">
        <div v-if="expandCompleted">
          <progress-box
            v-for="item in completedItems"
            :key="item._id"
            :item="item"
            :actor="actor"
            :showStar="true"
          />
        </div>
      </transition>
    </div>
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
.completed-slide-enter-active,
.completed-slide-leave-active {
  transition: all 0.4s ease-out;
  overflow: hidden;
  max-height: 1000px;
  opacity: 1;
}
.slide-enter,
.slide-leave-to,
.completed-slide-enter,
.completed-slide-leave-to {
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

  data() {
    return {
      expandCompleted: false,
    }
  },

  computed: {
    progressItems() {
      return this.actor.items
        .filter((x) => x.type === 'progress')
        .filter((x) => x.data.subtype !== 'bond')
    },

    activeItems() {
      return this.progressItems.filter((x) => !x.data.completed)
    },
    completedItems() {
      return this.progressItems.filter((x) => x.data.completed)
    },

    completedCaretClass() {
      return 'fa fa-caret-' + (this.expandCompleted ? 'down' : 'right')
    },
  },
}
</script>
