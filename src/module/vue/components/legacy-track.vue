<template>
  <div class="flexcol legacy-track">
    <div class="legacy-track-header flexrow">
      <h4>{{ title }}</h4>
      <p
        v-if="overflow"
        class="nogrow"
        style="padding: 1px; margin-right: 10px"
      >
        {{ overflow }}
      </p>
      <btn-faicon
        class="block"
        v-if="editMode"
        icon="caret-left"
        @click="decrease"
      />
      <btn-faicon class="block" icon="caret-right" @click="increase" />
    </div>

    <div class="flexrow track">
      <div
        class="flexcol track-box"
        v-for="(box, i) in boxes"
        :key="`box${i}`"
        v-html="box"
      ></div>
    </div>

    <xp-track :max="xpBoxCount" :marked="xpSpent" @click="setXp" />
  </div>
</template>

<style lang="less" scoped>
h4 {
  margin: 0.5rem 0;
}
.xp {
  max-height: 40px;
}
.legacy-track-header {
  align-items: center;
}
</style>

<script>
function ticksSvg(ticks) {
  let ret = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
  if (ticks > 0) ret += '<line x1="23" y1="23" x2="77" y2="77" />'
  if (ticks > 1) ret += '<line x1="77" y1="23" x2="23" y2="77" />'
  if (ticks > 2) ret += '<line x1="15" y1="50" x2="85" y2="50" />'
  if (ticks > 3) ret += '<line x1="50" y1="15" x2="50" y2="85" />'
  return ret + '</svg>'
}

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
      const ret = []
      let remainingTicks = this.ticks % 40
      for (let i = 0; i < 10; i++) {
        ret.push(ticksSvg(remainingTicks))
        remainingTicks -= 4
      }
      return ret
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
