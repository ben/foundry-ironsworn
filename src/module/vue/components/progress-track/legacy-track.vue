<template>
  <section class="legacy-track" :class="propKey">
    <legend class="legacy-track-title">{{ title }}</legend>

    <section class="legacy-track-controls">
      <span v-if="overflow" class="legacy-overflow">
        {{ overflow }}
      </span>
      <btn-faicon v-if="editMode" icon="caret-left" @click="decrease" class="remove-progress" />
      <btn-faicon icon="caret-right" @click="increase" class="mark-progress" />
    </section>

    <progress-track :ticks="ticks"> </progress-track>

    <xp-track :max="xpBoxCount" :marked="xpSpent" @click="setXp" :overflow="!!overflow" />
  </section>
</template>

<style lang="less">
@import '../../../../styles/fonts.less';

.legacy-track {
  display: grid;
  grid-template-rows: repeat(3, min-content);
  grid-template-columns: 1fr max-content;
  gap: 0 0.5em;
  grid-auto-flow: dense;
  grid-template-areas:
    'title ctrl'
    'bar bar'
    'xp xp';
  .legacy-track-title {
    grid-area: title;
    .text-heading();
    display: contents;
    padding: 0;
  }
  .legacy-track-controls {
    grid-area: ctrl;
    line-height: 1;
    display: flex;
    flex-flow: row nowrap;
    .legacy-overflow {
      padding: 1px;
      margin-right: 10px;
      flex-grow: 0;
    }
  }
  .progress-track {
    grid-area: bar;
  }
  .xp-track {
    margin-top: 0.5em;
    grid-area: xp;
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    propKey: String,
    title: String,
  },

  computed: {
    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
    },
    ticks() {
      return this.actor.data.legacies[this.propKey] ?? 0
    },
    xpBoxCount() {
      // 2 for each box up until 10, then 1 for each box afterwards
      const fullBoxes = Math.floor(this.ticks / 4)
      if (fullBoxes <= 10) {
        return fullBoxes * 2
      } else {
        return fullBoxes + 10
      }
    },
    xpArray() {
      const ret = []
      for (let i = 1; i <= this.xpBoxCount; i++) {
        ret.push(i)
      }
      return ret
    },
    xpSpent() {
      return this.actor.data.legacies[`${this.propKey}XpSpent`] ?? 0
    },
    overflow() {
      const n = Math.floor(this.ticks / 40) * 10
      if (n > 0) {
        return `(+${n})`
      }
    },
    boxes() {
      const boxesPerTrack = 10
      const ticksPerBox = 4
      let remainingTicks = this.ticks.valueOf()
      let result = []
      for (let i = 0; i < boxesPerTrack; i++) {
        const ticksToPush = Math.min(ticksPerBox, remainingTicks.valueOf())
        remainingTicks -= ticksToPush
        result.push(ticksToPush)
      }
      return result
    },
  },

  methods: {
    adjust(inc) {
      const current = this.actor.data?.legacies[this.propKey] ?? 0
      this.$actor.update({
        [`data.legacies.${this.propKey}`]: current + inc,
      })
    },
    increase() {
      this.adjust(1)
    },
    decrease() {
      this.adjust(-1)
    },

    setXp(n) {
      this.$actor.update({
        data: { legacies: { [`${this.propKey}XpSpent`]: n } },
      })
    },
  },
}
</script>
