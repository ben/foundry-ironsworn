<template>
  <component
    :is="el"
    :class="{
      [$style.fontIcon]: true,
      [$style.fontIconBorder]: border && !!$style.fontIconBorder,
      [$style.fontIconAnimation]: animation && !!$style.fontIconAnimation,
      ...classes,
    }"
    :aria-label="label"
    :role="label ? 'img' : 'presentational'"
    :aria-hidden="label ? false : true"
  />
</template>

<style lang="less" module>
.fontIcon {
  height: 1em;
  width: 1em;
  line-height: 1 !important;
}
.fontIconBorder {
  v-bind('borderOptions')
}
.fontIconAnimation {
  v-bind('animationOptions')
}
</style>

<script lang="ts" setup>
import { forEach } from 'lodash'
import { computed } from 'vue'
import { Icon } from './icon-helpers'

interface FontAwesomeIconProps {
  el?: any
  name: Icon.Name
  family?: Icon.Family
  /**
   * @remarks FVTT doesn't actually provide the FA6 sharp icons, so this shouldn't be used yet.
   */
  style?: Icon.Style
  /**
   * Unlabelled content is inaccessible, and will be rendered indicating as such so that screen readers don't try to read icon font glyphs.
   *
   * This can also be omitted if a tooltip or other label is provided for a parent component, like with most buttons.
   */
  label?: string
  /**
   * @see
   */
  border?: boolean
  /**
   * NYI
   */
  borderOptions?: Icon.Border.Options
  /**
   * Rether to render the item at a fixed width.
   * @default true
   * @see
   */
  fw?: boolean // fa-fw
  /**
   * For duotone icons only.
   */
  'swap-opacity'?: boolean // fa-swap-opacity
  /**
   * @see https://fontawesome.com/docs/web/style/lists
   */
  li?: boolean
  inverse?: boolean
  rotate?: Icon.Rotate
  size?: Icon.Size
  pull?: Icon.Pull
  animation?: Icon.Animation[]
  /**
   * NYI
   */
  animationOptions?: Icon.Animation.Options
  /**
   * Used with {@link FontIconStack}.
   */
  stack?: 'stack-1x' | 'stack-2x'
}

/**
 * A FontAwesome 6 icon.
 */
const props = withDefaults(defineProps<FontAwesomeIconProps>(), {
  family: Icon.Family.Solid,
  style: Icon.Style.Classic,
  fw: true,
  el: 'span',
})

const classes = computed(() => {
  const iconClasses: Record<string, boolean> = {
    icon: true,
    [`fa-${props.name}`]: true,
  }
  forEach(props, (value, key) => {
    switch (true) {
      case key === 'title':
      case key === 'icon':
      case key === 'size':
        // skip, these don't get set as classes
        break
      case key === 'animation' && value:
        ;(value as FontAwesomeIconProps['animation'])?.forEach(
          (cls) => (iconClasses[cls] = true)
        )
        break
      case typeof value === 'boolean':
        iconClasses[`fa-${key}`] = value as boolean
        break
      case typeof value === 'string':
        iconClasses[value as string] = true
        break
      default:
        break
    }
  })
  return iconClasses
})
</script>
