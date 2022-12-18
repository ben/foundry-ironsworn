<template>
  <svg
    :class="{ [$style.ironIcon]: true, icon: true }"
    :fill="color"
    :width="size"
    :height="size"
    role="img"
    aria-hidden="true"
  >
    <use :href="symbolId" />
  </svg>
</template>

<style lang="less" module>
// <!---->
.ironIcon {
}
</style>

<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import ids from 'virtual:svg-icons-names'

/**
 * Displays a custom SVG icon from the sprite sheet. Anything in `system/assets/icons` is automatically included as a sprite.
 */
const props = withDefaults(
  defineProps<{
    name: typeof ids
    prefix?: string
    size?: string
    color?: string
  }>(),
  {
    prefix: 'ironsworn',
    size: '1em',
    color: 'currentColor',
  }
)
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
