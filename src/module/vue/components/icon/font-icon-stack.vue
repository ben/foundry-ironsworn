<template>
  <component
    :is="el"
    :class="{ [$style.wrapper]: true, 'fa-stack': true }"
    :aria-label="label"
    :role="label ? 'img' : 'presentational'"
    :aria-hidden="label ? false : true"
  >
    <slot>
      <Icon class="fa-stack-2x" v-bind="bgOptions" />
      <Icon class="fa-stack-1x" v-bind="fgOptions" />
    </slot>
  </component>
</template>

<style lang="less" module>
.wrapper {
  // TODO
}
</style>

<script lang="ts" setup>
import { ExtractPropTypes } from 'vue'
import FontIcon from './font-icon.vue'
import Icon from './icon-helpers.vue'

interface IconStackLayerOptions
  extends Omit<ExtractPropTypes<typeof FontIcon>, 'size' | 'label'> {}

interface IconStackOptions
  extends Omit<
    ExtractPropTypes<typeof FontIcon>,
    'icon' | 'stack' | 'family' | 'style'
  > {
  bgOptions?: IconStackLayerOptions
  fgOptions?: IconStackLayerOptions
}

const props = withDefaults(defineProps<IconStackOptions>(), {})
</script>
