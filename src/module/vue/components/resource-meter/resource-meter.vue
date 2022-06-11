<template>
  <slider
    :id="id"
    @input="input"
    :segments="segments"
    :orientation="orientation"
    :current="current"
    class="resource-meter"
    segmentClasses="text clickable block"
    ><slot></slot
  ></slider>
</template>

<style lang="less">
@import '../../../../styles/fonts.less';
.slider.resource-meter {
  display: flex;
  flex-grow: 0;
  .text-display();
  & > * {
    border: 1px solid var(--color-fg);
    border-radius: 0;
    &:hover,
    &[aria-selected='true'] {
      z-index: 2;
    }
  }
  .slider-segment,
  .slider-segment label {
    text-align: center;
    min-width: 3ch;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1;
  }
  &[aria-orientation='vertical'] {
    flex-direction: column;
    & > * {
      height: 1.65rem;

      &:first-child {
        border-top-right-radius: var(--border-radius-sm);
        border-top-left-radius: var(--border-radius-sm);
      }
      &:last-child {
        border-bottom-right-radius: var(--border-radius-sm);
        border-bottom-left-radius: var(--border-radius-sm);
      }
      &:not(:first-child) {
        margin-top: -1px;
      }
    }
  }
  &[aria-orientation='horizontal'] {
    flex-direction: row;
    & > * {
      &:first-child {
        border-top-left-radius: var(--border-radius-sm);
        border-bottom-left-radius: var(--border-radius-sm);
      }
      &:last-child {
        border-top-right-radius: var(--border-radius-sm);
        border-bottom-right-radius: var(--border-radius-sm);
      }
      &:not(:first-child) {
        margin-left: -1px;
      }
    }
  }
}
</style>

<script>
import { kebabCase, range } from 'lodash'
import { IronswornActor } from '../../../actor/actor'
import { IronswornItem } from '../../../item/item'
export default {
  props: {
    actor: IronswornActor,
    /**
     * If present, the item's attribute will be used instead of the actor.
     */
    item: IronswornItem,
    current: Number,
    /**
     * The key of the attribute to be updated on the actor or item; for an asset meter, use `track`
     */
    attr: String,
    min: Number,
    max: Number,
    /**
     * Values above softmax will be rendered as disabled.
     */
    softMax: Number,
    withPlusSigns: Boolean,

    orientation: { type: 'vertical' | 'horizontal', default: 'vertical' },
  },
  computed: {
    id() {
      let nameFragment = kebabCase(this.attr)
      if (this.item) {
        return `${nameFragment}-${this.item._id}-${this.actor._id}`
      }
      return `${nameFragment}-${this.actor._id}`
    },
    segments() {
      let values = range(this.max, this.min - 1, -1)
      const result = values.map((value) => {
        const segment = {
          value,
          disabled: this.softMax ? value > this.softMax : false,
          labelText: `${this.withPlusSigns && value > 0 ? '+' : ''}${value}`,
          // labelContent: `${this.withPlusSigns && value > 0 ? '+' : ''}${value}`,
          // ariaLabel: '',
          // ariaDescription: '',
        }
        return segment
      })
      return result
    },
  },
  methods: {
    async input(newValue) {
      console.log('resource meter input event', newValue)
      await this.updateAttr(newValue)
      if (this.attr === 'supply') {
        CONFIG.IRONSWORN.IronswornSettings.maybeSetGlobalSupply(newValue)
      }
    },
    async updateAttr(value) {
      if (this.item) {
        await this.$item?.data.update({ data: { [this.attr]: { current: value } } })
      } else {
        await this.$actor?.data.update({ data: { [this.attr]: value } })
      }
    },
  },
}
</script>
