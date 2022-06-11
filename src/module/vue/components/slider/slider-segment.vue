<template>
  <div
    class="slider-segment"
    :class="classes"
    :aria-selected="selected"
    :aria-label="ariaLabel"
    :title="ariaLabel"
    :aria-description="ariaDescription"
    :aria-disabled="!!disabled"
  >
    <!--
  TIL that using the `disabled` html attribute is often less accessible than `aria-disabled` (one of the few cases where standard html semantics aren't preferred)

  TODO
  see the MDN article above has more info on implementation: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled
  -->
    <!-- TODO: figure out where to apply aria-valuetext -->
    <input
      type="radio"
      :id="id"
      :name="name"
      :checked="selected"
      :disabled="!!disabled"
      :value="value"
      :v-model="current"
      @input="input"
    />
    <label v-if="!!labelContent" :for="id">
      <component :is="labelContent"></component>
    </label>
    <label v-else :for="id">
      {{ labelText }}
    </label>
  </div>
</template>

<style lang="less">
.slider-segment {
  display: flex;
  text-align: center;
  label {
    flex-grow: 1;
    cursor: pointer;
  }
  input[type='radio'] {
    display: none !important;
    appearance: none !important;
  }
}

select {
  appearance: menulist-button;
}
</style>

<script>
export default {
  props: {
    ariaLabel: String, // also used for the title attribute
    ariaDescription: String, // optional extended description
    name: String,
    value: Number,
    current: Number,
    disabled: Boolean,
    id: String,
    labelText: String,
    labelContent: Object, // component to be placed in the label tag
  },
  computed: {
    selected() {
      return this.value === this.current
    },
    classes() {
      return {
        disabled: !!this.disabled,
      }
    },
  },
  methods: {
    async input(event) {
      console.log('slider-segment event', event)
      this.$emit('input', event.srcElement._value)
    },
  },
}
</script>
