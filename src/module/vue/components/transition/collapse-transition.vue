<template>
  <component
    :is="group ? TransitionGroup : Transition"
    :name="name"
    @before-appear="beforeAppear"
    @appear="appear"
    @after-appear="afterAppear"
    @appear-cancelled="appearCancelled"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @enter-cancelled="enterCancelled"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
    @leave-cancelled="leaveCancelled"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
// adapted for Vue3 from ivanvermeyen's collapse transition component: https://github.com/ivanvermeyen/vue-collapse-transition

import { computed, reactive } from '@vue/reactivity'
import { isEmpty, kebabCase } from 'lodash'
import { CSSProperties, Transition, TransitionGroup, watch } from 'vue'
import type { PropertiesHyphen } from 'csstype'

type Dimension = 'height' | 'width'

const props = withDefaults(
  defineProps<{
    /**
     * When `true`, the component is a `TransitionGroup` instead of a `Transition`.
     */
    group?: boolean
    /**
     * The name of the transition.
     * @default 'collapse'
     */
    name?: string
    /**
     * The orientation of the collapse transition.
     * @default 'height'
     */
    dimension?: Dimension
    /**
     * Animation duration in milliseconds.
     * @default 300
     */
    duration?: number
    /**
     * @default 'ease-in-out'
     */
    easing?: EffectTiming['easing']
  }>(),
  {
    name: 'collapse',
    dimension: 'height',
    duration: 300,
    easing: 'ease-in-out',
    group: false,
  }
)

const state = reactive<{ dimension: Dimension; cachedStyles: CSSProperties }>({
  cachedStyles: {},
  dimension: props.dimension,
})

watch(() => state.dimension, clearCachedDimensions)

const transition = computed(() => {
  let transitions: string[] = []
  Object.keys(state.cachedStyles).forEach((key) => {
    transitions.push(`${kebabCase(key)} ${props.duration}ms ${props.easing}`)
  })
  return transitions.join(', ')
})

const $emit = defineEmits<{
  (e: 'before-appear', el: HTMLElement): void
  (e: 'appear', el: HTMLElement): void
  (e: 'after-appear', el: HTMLElement): void
  (e: 'appear-cancelled', el: HTMLElement): void
  (e: 'before-enter', el: HTMLElement): void
  (e: 'enter', el: HTMLElement, callback: () => void): void
  (e: 'after-enter', el: HTMLElement): void
  (e: 'enter-cancelled', el: HTMLElement): void
  (e: 'before-leave', el: HTMLElement): void
  (e: 'leave', el: HTMLElement, callback: () => void): void
  (e: 'after-leave', el: HTMLElement): void
  (e: 'leave-cancelled', el: HTMLElement): void
}>()

function beforeAppear(el: HTMLElement) {
  // Emit the event to the parent
  $emit('before-appear', el)
}

function appear(el: HTMLElement) {
  // Emit the event to the parent
  $emit('appear', el)
}

function afterAppear(el: HTMLElement) {
  // Emit the event to the parent
  $emit('after-appear', el)
}

function appearCancelled(el: HTMLElement) {
  // Emit the event to the parent
  $emit('appear-cancelled', el)
}

function beforeEnter(el: HTMLElement) {
  // Emit the event to the parent
  $emit('before-enter', el)
}

function enter(el: HTMLElement, callback: () => void) {
  // Because width and height may be 'auto',
  // first detect and cache the dimensions
  detectAndCacheDimensions(el)

  // The order of applying styles is important:
  // - 1. Set styles for state before transition
  // - 2. Force repaint
  // - 3. Add transition style
  // - 4. Set styles for state after transition
  // If the order is not right and you open any 2nd level submenu
  // for the first time, the transition will not work.
  setClosedDimensions(el)
  hideOverflow(el)
  forceRepaint(el)
  setTransition(el)
  setOpenedDimensions(el)

  // Emit the event to the parent
  $emit('enter', el, callback)

  // Call callback() when the transition ends
  // to trigger the @after-enter event.
  setTimeout(callback, props.duration)
}

function afterEnter(el: HTMLElement) {
  // Clean up inline styles
  unsetOverflow(el)
  unsetTransition(el)
  unsetDimensions(el)
  clearCachedDimensions()

  // Emit the event to the parent
  $emit('after-enter', el)
}

function enterCancelled(el: HTMLElement) {
  // Emit the event to the parent
  $emit('enter-cancelled', el)
}

function beforeLeave(el: HTMLElement) {
  // Emit the event to the parent
  $emit('before-leave', el)
}

function setAbsolutePosition(el) {
  if (props.group) {
    el.style.position = 'absolute'
  }
}

function leave(el: HTMLElement, callback: () => void) {
  // For some reason, @leave triggered when starting
  // from open state on page load. So for safety,
  // check if the dimensions have been cached.
  detectAndCacheDimensions(el)

  // The order of applying styles is less important
  // than in the enter phase, as long as we repaint
  // before setting the closed dimensions.
  // But it is probably best to use the same
  // order as the enter phase.
  setOpenedDimensions(el)
  hideOverflow(el)
  forceRepaint(el)
  setTransition(el)
  setClosedDimensions(el)
  setAbsolutePosition(el)

  // Emit the event to the parent
  $emit('leave', el, callback)

  // Call callback() when the transition ends
  // to trigger the @after-leave event.
  // This will also cause v-show
  // to reapply 'display: none'.
  setTimeout(callback, props.duration)
}

function afterLeave(el: HTMLElement) {
  // Clean up inline styles
  unsetOverflow(el)
  unsetTransition(el)
  unsetDimensions(el)
  clearCachedDimensions()

  // Emit the event to the parent
  $emit('after-leave', el)
}

function leaveCancelled(el: HTMLElement) {
  // Emit the event to the parent
  $emit('leave-cancelled', el)
}

function detectAndCacheDimensions(el: HTMLElement) {
  // Cache actual dimensions
  // only once to void invalid values when
  // triggering during a transition
  if (!isEmpty(state.cachedStyles)) return

  const visibility = el.style.visibility
  const display = el.style.display

  // Trick to get the width and
  // height of a hidden element
  el.style.visibility = 'hidden'
  el.style.display = ''

  state.cachedStyles = detectRelevantDimensions(el)

  // Restore any original styling
  el.style.visibility = visibility
  el.style.display = display
}

function clearCachedDimensions() {
  state.cachedStyles = {}
}

function detectRelevantDimensions(el: HTMLElement): CSSProperties {
  // These properties will be transitioned
  if (state.dimension === 'height') {
    console.log({
      height: el.offsetHeight + 'px',
      paddingTop: el.style.paddingTop || getCssValue(el, 'padding-top'),
      paddingBottom:
        el.style.paddingBottom || getCssValue(el, 'padding-bottom'),
    })
    return {
      height: el.offsetHeight + 'px',
      paddingTop: el.style.paddingTop || getCssValue(el, 'padding-top'),
      paddingBottom:
        el.style.paddingBottom || getCssValue(el, 'padding-bottom'),
    }
  }

  if (state.dimension === 'width') {
    return {
      width: el.offsetWidth + 'px',
      paddingLeft: el.style.paddingLeft || getCssValue(el, 'padding-left'),
      paddingRight: el.style.paddingRight || getCssValue(el, 'padding-right'),
    }
  }

  return {}
}

function setTransition(el: HTMLElement) {
  el.style.transition = transition.value
}

function unsetTransition(el: HTMLElement) {
  el.style.transition = ''
}

function hideOverflow(el: HTMLElement) {
  el.style.overflow = 'hidden'
}

function unsetOverflow(el: HTMLElement) {
  el.style.overflow = ''
}

function setClosedDimensions(el: HTMLElement) {
  Object.keys(state.cachedStyles).forEach((key) => {
    el.style[key] = '0'
  })
}

function setOpenedDimensions(el: HTMLElement) {
  Object.keys(state.cachedStyles).forEach((key) => {
    el.style[key] = state.cachedStyles[key]
  })
}

function unsetDimensions(el: HTMLElement) {
  Object.keys(state.cachedStyles).forEach((key) => {
    el.style[key] = ''
  })
}

function forceRepaint(el: HTMLElement) {
  // Force repaint to make sure the animation is triggered correctly.
  // Thanks: https://markus.oberlehner.net/blog/transition-to-height-auto-with-vue/
  getComputedStyle(el)[state.dimension]
}

function getCssValue(el: HTMLElement, style: keyof PropertiesHyphen) {
  return getComputedStyle(el, null).getPropertyValue(style)
}
</script>
