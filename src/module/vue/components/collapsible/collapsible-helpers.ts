export type ExpandEvent = (
	expandedElement?: HTMLElement,
	triggerElement?: HTMLElement,
	collapsibleComponent?: HTMLElement
) => void
export type CollapseEvent = (
	collapsedElement?: HTMLElement,
	triggerElement?: HTMLElement,
	collapsibleElement?: HTMLElement
) => void
