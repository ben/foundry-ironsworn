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
  display: flex;
  position: relative;
  justify-content: center;
  width: 1em;
  height: 1em;
  line-height: 1 !important;

  &::before {
    display: flex-item;
    flex-basis: 0;
  }
}

.fontIconBorder {
  each(v-bind('borderOptions'), {
    @{key}: @value
  });
}

.fontIconAnimation {
  each(v-bind('animationOptions'), {
    @{key}: @value;
  });
}
</style>

<script lang="ts" setup>
import { forEach } from 'lodash'
import { computed } from 'vue'
import { FontAwesome, IconPropsCommon } from './icon-common'

interface FontAwesomeIconProps extends IconPropsCommon {
  /**
   * @default `span`
   */
  el?: any
  name: FontAwesome.Name
  family?: FontAwesome.Family
  /**
   * @remarks FVTT doesn't actually provide the FA6 sharp icons, so this shouldn't be used yet.
   */
  style?: FontAwesome.Style
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
  borderOptions?: FontAwesome.Border.Options
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
  rotate?: FontAwesome.Rotate
  size?: FontAwesome.Size
  pull?: FontAwesome.Pull
  animation?: FontAwesome.Animation[]
  /**
   * NYI
   */
  animationOptions?: FontAwesome.Animation.Options
  /**
   * Used with {@link FontIconStack}.
   */
  stack?: 'stack-1x' | 'stack-2x'
}

/**
 * A FontAwesome 6 icon.
 */
const props = withDefaults(defineProps<FontAwesomeIconProps>(), {
  family: FontAwesome.Family.Solid,
  style: FontAwesome.Style.Classic,
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
