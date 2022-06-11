<template>
  <fieldset class="slider" tab-index="0" :aria-orientation="orientation" role="slider" :v-model="current" :id="id">
    <slot><!-- for embedded buttons, etc --></slot>
    <slider-segment
      v-for="segment in segments"
      :class="segmentClasses"
      :id="childId(segment.value)"
      :key="segment.value"
      :name="id"
      :value="segment.value"
      :current="current"
      :disabled="segment.disabled"
      :labelText="segment.labelText"
      :labelContent="segment.labelContent"
      :ariaLabel="segment.ariaLabel"
      :ariaDescription="segment.ariaDescription"
      @input="input"
    >
    </slider-segment>
  </fieldset>
</template>

<style lang="less"></style>

<script>
import { kebabCase } from 'lodash'
export default {
  props: {
    /**
     * Passed to the html attribute `aria-orientation`.
     * @todo To be fully keyboard accessible, keybinds would need to be set manually to reflect the orientation.
     */
    orientation: { type: 'vertical' | 'horizontal', default: 'vertical' },
    current: Number | String,
    segmentClasses: String | Object,
    /**
     * id for the slider. also used as a "name" attribute to identify the radio group.
     * slider segments affix this to create their own IDs.
     */
    id: String,
    segments: [
      {
        value: Number | String,
        disabled: Boolean,
        labelContent: Object, // component to be placed in the label tag
        labelText: String, // alternative to labelContent
        ariaLabel: String, // also used for the title attribute
        ariaDescription: String, // optional extended description
      },
    ],
  },
  computed: {},
  methods: {
    childId(value) {
      return this.id + '-' + kebabCase(value)
    },
    async input(event) {
      console.log('slider event', event)
      this.$emit('input', event)
    },
  },
}
</script>
