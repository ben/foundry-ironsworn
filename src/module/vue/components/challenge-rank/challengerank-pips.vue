<template>
  <fieldset class="challenge-rank-pips bar-hover-preview">
    <component :is="svg" v-for="r in ranks" v-bind="r" :key="r.key"> </component>
  </fieldset>
</template>

<style lang="less">
// .bar-hover-preview {
//   & > * {
//     fill: var(--color-widget-fill);
//     fill-opacity: 1;
//   }
//   &:hover > * {
//     fill-opacity: 0.5;
//     &:hover ~ * {
//       fill-opacity: 0;
//     }
//   }
//   &:not(:hover) > * {
//     &[aria-selected='true'] ~ * {
//       fill-opacity: 0;
//     }
//   }
// }

.challenge-rank-pips {
  --color-widget-fill: var(--color-midtone);
  display: flex;
  flex-flow: row nowrap;
  width: max-content;
  height: max-content;
  pointer-events: fill;
  .challenge-rank-pip {
    height: 19px;
    width: 17px;
    border: 0;
    flex-grow: 0;
    margin: 0;
    stroke-width: 1;
    stroke: currentColor;
    pointer-events: fill;
  }
}
</style>
<script>
export default {
  props: {
    current: String,
    svg: Object,
  },
  computed: {
    ranks() {
      const keys = Object.keys(CONFIG.IRONSWORN.Ranks)
      const position = keys.indexOf(this.current)
      return keys.map((r) => {
        const rankIndex = keys.indexOf(r)
        // const selected = rankIndex <= position
        return {
          rank: r,
          'aria-selected': rankIndex === position,
          title: this.title(r),
          role: 'button',
          class: 'challenge-rank-pip clickable',
          'v-on:click': this.click(r),
        }
      })
    },
  },
  methods: {
    title(rank) {
      const i18nKey = `IRONSWORN.${this.$capitalize(rank)}`
      return $t(i18nKey)
    },
    click(rank) {
      console.log('challenge rank click event', rank)
    },
  },
}
</script>
