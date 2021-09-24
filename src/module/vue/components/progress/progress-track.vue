<template>
  <div class="flexrow track">
    <div
      class="flexcol track-box"
      v-for="(box, i) in boxes"
      :key="i"
      v-html="box"
    ></div>
  </div>
</template>

<script>
function ticksSvg(ticks) {
  let ret = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
  if (ticks > 0) ret += '<line x1="15" y1="15" x2="85" y2="85" />'
  if (ticks > 1) ret += '<line x1="85" y1="15" x2="15" y2="85" />'
  if (ticks > 2) ret += '<line x1="15" y1="50" x2="85" y2="50" />'
  if (ticks > 3) ret += '<line x1="50" y1="15" x2="50" y2="85" />'
  return ret + '</svg>'
}

export default {
  props: {
    ticks: Number,
  },

  computed: {
    boxes() {
      const ret = []
      let remainingTicks = this.ticks
      for (let i = 0; i < 10; i++) {
        ret.push(ticksSvg(remainingTicks))
        remainingTicks -= 4
      }
      return ret
    },
  },
}
</script>
