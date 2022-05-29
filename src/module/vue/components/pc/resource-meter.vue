<template>
  <fieldset class="resource-meter" :v-model="$actor.data[attr]">
    <meter-box v-for="x in range" :key="x" :actor="actor" :attr="attr" :value="x" :softMax="softMax"></meter-box>
  </fieldset>
</template>

<style lang="less">
@import '../../../../styles/fonts.less';
.resource-meter {
  flex-grow: 0;
  .text-display();
}
</style>

<script>
export default {
  props: {
    actor: Object,
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
      await this.$actor.data.update({ data: { [this.attr]: value } })
    },
    async input(event) {
      // console.log('input', event)
      let newValue = event.srcElement._value // this prop gets the number value rather than getting the string value
      await this.updateAttr(newValue)
    },
  },
}
</script>
