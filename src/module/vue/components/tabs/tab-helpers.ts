// adapted from https://github.com/jakedohm/vue-accessible-tabs
// more about the recommendations for this design pattern, for later reference: https://www.w3.org/WAI/ARIA/apg/example-index/tabs/tabs-manual.html

import { inject, InjectionKey } from 'vue'

export type TabKey = string | number
export type TabActivationMode = 'auto' | 'manual'
export type Orientation = 'horizontal' | 'vertical'
export type FocusActivePanel = () => void
export type SetActivePanelRef = (ref: HTMLElement) => void
export type SetActiveTab<TabKeyType = TabKey> = (tabKey: TabKeyType) => void
export type TabIndexIncrementer = (tabCount: number) => void

export interface TabState<TabKeyType = TabKey> {
  activeTab: TabKeyType
  activePanelRef: HTMLElement | null
  focusedTab: TabKeyType | null
  orientation: Orientation
  mode: TabActivationMode
  tabKeys: TabKeyType[]
  tabSetId: string
}

export const TabStateKey = Symbol('tabState') as InjectionKey<TabState>
export const SetActiveTabKey = Symbol(
  'setActiveTab'
) as InjectionKey<SetActiveTab>
export const SetActivePanelRefKey = Symbol(
  'setActivePanelRef'
) as InjectionKey<SetActivePanelRef>
export const FocusActivePanelKey = Symbol(
  'focusActivePanel'
) as InjectionKey<FocusActivePanel>

/**
 * Validates descendant Tab and TabPanel components.
 * @param role The component type to validate.
 * @param element The element of the mounted component.
 */
export function validateTabSetRole(
  tabState: TabState,
  element: HTMLElement,
  role: 'TabPanel' | 'Tab'
) {
  const tabElements = element.querySelectorAll(
    `[data-tab-set="${tabState.tabSetId}"][role=${role.toLowerCase()}]`
  )
  if (!tabElements ?? tabElements?.length !== 0) {
    throw Error(
      `TabList for ${tabState.tabSetId} contains no ${role} descendants.`
    )
  }
  const tabElementKeys = new Set()
  tabElements.forEach((tabElement) => {
    const tabElementKey = (tabElement as HTMLElement).dataset.tabKey
    if (!tabElementKey) {
      throw Error(`${role}'s key is invalid: ${tabElementKey?.toString()} `)
    }
    tabElementKeys.add(tabElementKey)
  })
  tabState.tabKeys.forEach((tabComponentKey) => {
    if (!tabElementKeys.has(tabComponentKey.toString())) {
      throw Error(
        `TabSet includes a ${role} keyed with ${JSON.stringify(
          tabComponentKey
        )}, but this isn't included in the TabSet's tabKeys prop.`
      )
    }
  })
}
