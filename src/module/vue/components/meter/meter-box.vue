<template>
  <label class="meter-box clickable block" :class="classes" :disabled="disabled">
    <input
      type="radio"
      :name="attr"
      :checked="selected"
      :disabled="disabled"
      :data-resource="attr"
      :value="value"
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
  border-top: none;
  text-align: center;
  line-height: 28px;
  border: 0;
  // &:first-child {
  //   border-top: 1px solid;
  //   border-top-left-radius: 5px;
  //   border-top-right-radius: 5px;
  // }
  // &:last-child {
  //   border-bottom-left-radius: 5px;
  //   border-bottom-right-radius: 5px;
  // }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    attr: String,
    item: Object, // optional. if present, the item's attribute will be used instead
    value: Number,
    softMax: Number,
    selected: Boolean,
  },
  computed: {
    id() {
      if (this.item) {
        return `meter_${this.attr}_${this.value}_${this.item._id}`
      }

      return `meter_${this.attr}_${this.value}_${this.actor._id}`
    },
    classes() {
      return {
        [this.attr]: true,
        selected: this.selected,
        disabled: this.disabled,
      }
    },
    valueStr() {
      return this.value > 0 ? `+${this.value}` : this.value.toString()
    },
    disabled() {
      return this.value > this.softMax
    },
  },
  methods: {
    input(event) {
      this.$emit('input', event)
    },
  },
}
</script>
