<template>
  <label :class="classes" :disabled="disabled">
    <input
      type="radio"
      :name="attr"
      :checked="selected ? '' : false"
      :disabled="disabled"
      :data-resource="attr"
      :data-value="value"
      @input="input"
    />
    <span class="label-text">{{ valueStr }}</span>
  </label>
</template>

<style lang="less">
.meter-box {
  input[type='radio'] {
    display: none !important;
    appearance: none !important;
  }
  flex: 0 0 auto;
  min-width: 50px;
  border: 1px solid;
  border-top: none;
  text-align: center;
  line-height: 28px;
  &:first-child {
    border-top: 1px solid;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  &:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    attr: String,
    value: Number,
    softMax: Number,
  },
  computed: {
    id() {
      return `meter_${this.attr}_${this.value}_${this.actor._id}`
    },
    classes() {
      return {
        'meter-box': true,
        clickable: true,
        block: true,
        [this.attr]: true,
        selected: this.selected,
        disabled: this.disabled,
      }
    },
    valueStr() {
      return this.value > 0 ? `+${this.value}` : this.value.toString()
    },
    current() {
      return this.actor.data[this.attr]
    },
    selected() {
      return this.current === this.value
    },
    disabled() {
      return this.value > this.softMax
    },
  },

  methods: {
    input(event) {
      if (this.disabled) return
      // TODO: replace with this.$actor
      const actor = game.actors?.get(this.actor._id)
      actor?.update({ data: { [this.attr]: this.value } })
      console.log('meter-box', event)
      if (this.attr === 'supply') {
        CONFIG.IRONSWORN.IronswornSettings.maybeSetGlobalSupply(this.value)
      }
    },
  },
}
</script>
