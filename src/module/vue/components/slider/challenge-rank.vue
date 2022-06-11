<template>
  <slider
    class="challenge-rank slider-hover-preview"
    @input="setRank"
    :current="current"
    :segments="segments"
    :name="name"
    :id="name"
  >
  </slider>
</template>

<style lang="less">
.slider-hover-preview {
  &:hover {
    fill-opacity: 0.5;
    & > .slider-segment {
      &:hover {
        & ~ .slider-segment {
          fill-opacity: 0;
        }
      }
    }
  }
  &:not(:hover) {
    fill-opacity: 1;
    & > .slider-segment {
      &[aria-selected='true'] {
        fill: var(--color-widget-fill);
        & ~ .slider-segment {
          fill-opacity: 0;
        }
      }
    }
  }
}

.challenge-rank {
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  width: max-content;
  fill: var(--color-widget-fill);
  pointer-events: fill;
  .slider-segment {
    pointer-events: fill;
    height: max-content;
    width: max-content;
    label {
      height: max-content;
      width: max-content;
      svg {
        stroke-width: 1;
        stroke: currentColor;
        height: 19px;
        width: 17px;
      }
    }
  }
}
</style>

<script>
import { RANKS } from '../../../constants'

export default {
  props: {
    item: Object,
    actor: Object,
    pipSvg: Object,
  },
  computed: {
    segments() {
      return Object.keys(RANKS).map((rank) => ({
        value: rank,
        disabled: false,
        labelContent: this.pipSvg,
        ariaLabel: this.$t(`IRONSWORN.${this.$capitalize(rank)}`),
      }))
    },
    name() {
      let id
      if (this.item) {
        id = this.item?._id
      } else if (this.actor) {
        id = this.actor?._id
      }
      return `rank-${id}`
    },
    current() {
      if (this.item) {
        return this.item.data.rank
      } else if (this.actor) {
        return this.actor.data.rank
      }
    },
  },
  methods: {
    title(rank) {
      const i18nKey = `IRONSWORN.${this.$capitalize(rank)}`
      return this.$t(i18nKey)
    },
    async setRank(rank) {
      const document = this.$item ?? this.$actor
      await document?.update({ data: { rank } })
    },
  },
}
</script>
