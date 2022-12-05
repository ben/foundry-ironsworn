// adapted from https://github.com/jakedohm/vue-accessible-tabs
// more about the recommendations for this design pattern, for later reference: https://www.w3.org/WAI/ARIA/apg/example-index/tabs/tabs-manual.html

import { InjectionKey } from 'vue'

export type TabActivationMode = 'auto' | 'manual'
export type Orientation = 'horizontal' | 'vertical'
export type FocusActivePanel = () => void
export type SetActivePanelRef = (ref: HTMLElement) => void
export type SetActiveTab = (tabIndex: number) => void
export type TabIndexIncrementer = (tabCount: number) => void

export interface TabState {
  activeTab: number
  activePanelRef: HTMLElement | null
  focusedTab: number | null
  orientation: Orientation
  mode: TabActivationMode
  _id: string
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

export const TabCountKey = Symbol('tabCount') as InjectionKey<number>
