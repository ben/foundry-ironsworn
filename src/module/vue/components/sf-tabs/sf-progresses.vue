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
          @completed="progressCompleted"
        />
      </transition-group>
      <progress-controls :actor="actor" />
    </div>

    <div class="item-row nogrow" style="margin-top: 1rem">
      <h3
        class="clickable text"
        :class="completedClass"
        @click="expandCompleted = !expandCompleted"
      >
        <i :class="completedCaretClass"></i> {{ $t('IRONSWORN.Completed') }}
      </h3>
      <transition
        name="completed-slide"
        tag="div"
        class="nogrow"
        style="margin: 0; padding: 0"
      >
        <div v-if="expandCompleted">
          <transition-group name="slide" tag="div" class="nogrow">
            <progress-box
              v-for="item in completedItems"
              :key="item._id"
              :item="item"
              :actor="actor"
              :showStar="true"
            />
          </transition-group>
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="less" scoped>
h3 {
  margin: 5px 0;
  transition: background-color 0.2s ease;
  i {
    width: 15px;
    text-align: center;
  }

  &.highlighted {
    background-color: lightyellow;
  }
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
  overflow: hidden;
  max-height: 106px;
  opacity: 1;
}
.completed-slide-enter-active,
.completed-slide-leave-active {
  transition: all 0.4s ease-out;
  overflow: hidden;
  max-height: 400px;
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
      highlightCompleted: false,
      highlightCompletedTimer: null,
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

    completedClass() {
      return this.highlightCompleted ? 'highlighted' : undefined
    },
  },

  methods: {
    progressCompleted() {
      this.highlightCompleted = true
      clearTimeout(this.highlightCompletedTimer)
      this.highlightCompletedTimer = setTimeout(() => {
        this.highlightCompleted = false
      }, 2000)
    },
  },
}
</script>
