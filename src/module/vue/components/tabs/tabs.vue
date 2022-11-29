<template>
  <component :is="wrapperElement ?? 'section'" class="flexcol tabbed-panels">
    <nav role="tablist" :aria-orientation="ariaOrientation ?? 'horizontal'">
      <BtnIcon
        v-for="tabProp in tabsProps"
        :class="tabProp.icon"
        role="tab"
        type="button"
        buttonStyle="block"
        :id="tabId(tabProp.title)"
        :aria-controls="tabPanelId(tabProp.title)"
        :aria-selected="selectedTitle === tabProp.title"
        :key="tabProp.title"
        @click="selectedTitle = tabProp.title"
      >
        {{ tabProp.title }}
      </BtnIcon>
    </nav>
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { inject, provide, ref, useSlots } from 'vue'
import { $ActorKey } from '../../provisions'
import BtnIcon from '../buttons/btn-icon.vue'
import Tab from './tab.vue'
const props = defineProps<{
  wrapperElement?: string
  name?: string
  ariaOrientation?: 'horizontal' | 'vertical'
}>()

type TabProps = InstanceType<typeof Tab>['$props']

const slots = useSlots()
const tabsProps = ref(slots?.default?.().map((tab) => tab.props as TabProps))
const selectedTitle = ref(tabsProps?.value?.[0].title)
provide('selectedTitle', selectedTitle)

const actor = inject($ActorKey)
const stubId = (title: string) => `${props.name}-${title}-${actor?.id}`
const tabPanelId = (title: string) => `tabpanel-${stubId(title)}`
const tabId = (title: string) => `tab-${stubId(title)}`

const selectIndex = (i: number) => {
  selectedTitle.value = tabsProps?.value?.[i].title
}
defineExpose({ selectIndex })
</script>

<style lang="less" scoped>
@import '../../../../styles/mixins.less';
.tabbed-panels {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  .item,
  [role='tab'], // so it doesn't catch things that only start with 'tab'
  [role^='tab '],
  [role*=' tab'] {
    height: 100%;
    overflow-y: visible;
    padding: var(--ironsworn-spacer-md);
    &:before {
      font-size: 140%;
    }
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
      border-block-end: var(--ironsworn-border-width-md) solid
        var(--ironsworn-color-border);
    }
    &[aria-orientation='vertical'] {
      border-inline-start: var(--ironsworn-border-width-md) solid
        var(--ironsworn-color-border);
      border-inline-end: var(--ironsworn-border-width-md) solid
        var(--ironsworn-color-border);
    }
  }
  [role^='tabpanel'],
  [role*=' tabpanel'] {
    margin: 0.5rem;
    flex: 1;
  }
}
</style>
