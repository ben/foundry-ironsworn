<template>
  <svg
    :fill="color"
    :height="size ?? '1em'"
    :width="size ?? '1em'"
    role="img"
    aria-hidden="true"
    :class="{ icon: true }"
  >
    <use :href="symbolId" />
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FillProperty } from 'csstype'
import type { IconPropsCommon, IronswornIconName } from './icon-common'

interface Props extends IconPropsCommon {
  name: IronswornIconName
  /**
   * The color to use for the SVG fill property.
   * @default 'currentColor'
   */
  color?: FillProperty
  /**
   * The prefix of the sprite map. You probably don't need to change this.
   * @default 'ironsworn'
   */
  prefix?: string
  size?: string
  disabled?: boolean
}

/**
 * Displays a custom SVG icon from the sprite sheet. Anything in `system/assets/icons` is automatically included as a sprite.
 */
const props = withDefaults(defineProps<Props>(), {
  prefix: 'ironsworn',
  size: '1em',
  color: 'currentColor',
})
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
