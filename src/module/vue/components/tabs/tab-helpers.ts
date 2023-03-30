// adapted from https://github.com/jakedohm/vue-accessible-tabs
// more about the recommendations for this design pattern, for later reference: https://www.w3.org/WAI/ARIA/apg/example-index/tabs/tabs-manual.html

import type { InjectionKey } from 'vue'

// not strictly necessary, but helps clarify what the string values reperesent
export type TabKey = string
export type TabActivationMode = 'auto' | 'manual'
export type Orientation = 'horizontal' | 'vertical'
export type FocusActivePanel = () => void
export type SetActivePanelRef = (ref: HTMLElement) => void
export type SetActiveTab<TabKeyType = TabKey> = (tabKey: TabKeyType) => void
export type TabIndexIncrementer = (tabCount: number) => void

export function getTabId(tabSetId: string, tabKey: TabKey) {
	return `tabs--${tabSetId}--tab--${tabKey}`
}
export function getTabPanelId(tabSetId: string, tabKey: TabKey) {
	return `tabs--${tabSetId}--panel--${tabKey}`
}

export interface TabState {
	activeTab: TabKey
	activePanelRef: HTMLElement | null
	focusedTab: TabKey | null
	orientation: Orientation
	mode: TabActivationMode
	tabKeys: TabKey[]
	tabSetId: string
	previousTab: TabKey
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

export function getSlideTransitionName(
	thisIndex: number,
	oldIndex: number,
	newIndex: number,
	orientation: 'horizontal' | 'vertical'
) {
	// for a horizontal tab set: lower = positioned to the left, higher = positioned to the right
	const horizontal = orientation === 'horizontal'
	// for a vertical tab set: lower = positioned above, higher = positioned below
	const vertical = orientation === 'vertical'

	switch (true) {
		case horizontal && oldIndex < newIndex && thisIndex === oldIndex:
		case horizontal && oldIndex > newIndex && thisIndex === newIndex:
			return 'slideLeft'
		case horizontal && oldIndex < newIndex && thisIndex === newIndex:
		case horizontal && oldIndex > newIndex && thisIndex === oldIndex:
			return 'slideRight'
		case vertical && oldIndex < newIndex && thisIndex === oldIndex:
		case vertical && oldIndex > newIndex && thisIndex === newIndex:
			return 'slideUp'
		case vertical && oldIndex < newIndex && thisIndex === newIndex:
		case vertical && oldIndex > newIndex && thisIndex === oldIndex:
			return 'slideDown'
		default:
			return ''
	}
}
