<!-- the basic meter/bar component used to compose displays for condition meters and other resources. if you want a complete condition meter for a PC or asset, see the condition-meter component instead. if you want a momentum readout, see momentum-widget -->

<template>
  <fieldset class="resource-meter" :v-model="model">
    <slot></slot>
    <meter-box
      v-for="x in range"
      :item="item"
      :key="x"
      :actor="actor"
      :attr="attr"
      :value="x"
      :softMax="softMax"
      :selected="current === x"
      @input="input"
    ></meter-box>
  </fieldset>
</template>

<style lang="less">
@import '../../../../styles/fonts.less';
fieldset.resource-meter {
  background: currentColor;
  gap: 1px;
  flex-grow: 0;
  .text-display();
  border: 1px solid;
  border-radius: 5px;
  overflow: clip;
  > *,
  .resource-meter-title {
    background: var(--background-color);
    border: 0;
  }
  .meter-box {
  }
}
</style>

<script>
import { IronswornActor } from '../../../actor/actor'
import { IronswornItem } from '../../../item/item'
export default {
  props: {
    actor: IronswornActor,
    item: IronswornItem, // optional. if present, the item's attribute will be used instead
    attr: String,
    min: Number,
    max: Number,
    softMax: Number,
    current: Number,
  },
  computed: {
    range() {
      let range = []
      for (let i = this.min; i < this.max + 1; i++) {
        range.unshift(i)
      }
      return range
    },
    model() {
      if (this.item) {
        return this.$item.data.data[this.attr].current
      } else {
        return this.$actor.data[this.attr]
      }
    },
  },
  methods: {
    async updateAttr(value) {
      // console.log('clicked updateAttr', value)
      if (this.item) {
        // console.log('this.$item?.data', this.$item?.data)
        // console.log('this.$item?.data.data', this.$item?.data.data)
        await this.$item?.data.update({ data: { [this.attr]: { current: value } } })
      } else {
        await this.$actor?.data.update({ data: { [this.attr]: value } })
      }
    },
    async input(event) {
      console.log('resource meter box event', event)
      // console.log(this.current)
      await this.updateAttr(event.target._value)
      // console.log(this.current)
      if (this.attr === 'supply') {
        CONFIG.IRONSWORN.IronswornSettings.maybeSetGlobalSupply(event.target._value)
      }
    },
  },
}
</script>
