<template>
  <fieldset class="resource-meter" :v-model="$actor.data[attr]">
    <meter-box v-for="x in range" :key="x" :actor="actor" :attr="attr" :value="x" :softMax="softMax"></meter-box>
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
  .meter-box {
    background: var(--background-color);
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
  },
  computed: {
    range() {
      let range = []
      for (let i = this.min; i < this.max + 1; i++) {
        range.unshift(i)
      }
      return range
    },
  },
  methods: {
    async updateAttr(value) {
      // console.log('clicked', value)
      if (this.item) {
        await this.$item?.update({ data: { [this.attr]: value } })
      } else {
        await this.$actor?.data.update({ data: { [this.attr]: value } })
      }
    },
    async input(event) {
      // "_value" gets the number value, rather than getting the string "value"
      console.log(event)
      await this.updateAttr(event.targetElement._value)
    },
  },
}
</script>
