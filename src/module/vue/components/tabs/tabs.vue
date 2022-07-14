<template>
  <component :is="wrapperElement" class="flexcol tabbed-panels">
    <nav role="tablist" :aria-orientation="ariaOrientation">
      <button
        v-for="(title, i) in tabTitles"
        class="block clickable text"
        role="tab"
        type="button"
        :id="tabId(i)"
        :aria-controls="tabPanelId(i)"
        :aria-selected="selectedTitle === title"
        :key="title"
        @click="selectedTitle = title"
      >
        {{ title }}
      </button>
    </nav>
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { inject, PropType, provide, ref, useSlots } from 'vue'
import { IronswornActor } from '../../../actor/actor'

const props = defineProps({
  // What to wrap this element in
  wrapperElement: {
    type: String,
    default: 'section',
  },

  /* used to distinguish this from other tab panels for purpose of ID generation */
  name: String,

  // orientation of the tabs
  ariaOrientation: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal',
    options: ['horizontal', 'vertical'],
  },
})

const slots = useSlots()
const tabTitles = ref(slots?.default?.().map((tab) => tab.props?.title))
const selectedTitle = ref(tabTitles?.value?.[0])
provide('selectedTitle', selectedTitle)

const actor = inject('actor') as IronswornActor | undefined
const stubId = (i: number) => `${props.name}-${tabTitles[i]}-${actor?.id}`
const tabPanelId = (i: number) => `tabpanel-${stubId(i)}`
const tabId = (i: number) => `tab-${stubId(i)}`
</script>

<style lang="less">
.tabbed-panels {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  .item,
  [role='tab'], // so it doesn't catch things that only start with 'tab'
  [role^='tab '],
  [role*=' tab'] {
    border: 0;
    flex: 1 1 0;
    text-align: center;
    height: 100%;
    overflow-y: auto;
    padding: 5px;
    &.active,
    &[aria-selected='true'] {
      text-shadow: none;
    }
  }
  .tabs,
  [role^='tablist'],
  [role*=' tablist'] {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-grow: 0;
    height: max-content;

    &[aria-orientation='horizontal'] {
      border-block-end: 1px solid;
    }
    &[aria-orientation='vertical'] {
      border-inline-start: 1px solid;
      border-inline-end: 1px solid;
    }
  }
  [role^='tabpanel'],
  [role*=' tabpanel'] {
    margin: 0.5rem;
    flex: 1;
  }
}
</style>
