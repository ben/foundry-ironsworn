import type { IronswornActor } from '../../../actor/actor'
import type { ProgressDataPropertiesData } from '../../../item/itemtypes'

export type CompletedProgressType = 'completed-only' | 'no-completed' | 'all'
export type ProgressSubtype = ProgressDataPropertiesData['subtype']

export function isValidProgressItem(
	item: any,
	showCompleted: CompletedProgressType,
	excludedSubtypes?: ProgressSubtype[]
) {
	if (item.type === 'progress') {
		switch (showCompleted) {
			case 'completed-only': {
				if (!item.system.completed) {
					return false
				}
				break
			}
			case 'no-completed': {
				if (item.system.completed) {
					return false
				}
				break
			}
			default:
				break
		}
		if ((excludedSubtypes ?? []).includes(item.system.subtype)) {
			return false
		}
		return true
	}
	return false
}

export function getProgressItems(
	actor: IronswornActor,
	showCompleted: CompletedProgressType,
	excludedSubtypes?: ProgressSubtype[]
) {
	const items = actor.items
		.filter((item) =>
			isValidProgressItem(item, showCompleted, excludedSubtypes ?? [])
		)
		.sort((a, b) => (a.sort || 0) - (b.sort || 0)) as any[]
	return items ?? []
}
