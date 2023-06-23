import type { IronswornActor } from '../../../actor/actor'
import type { ProgressDataPropertiesData } from '../../../item/subtypes/progress'

export type CompletedProgressType = 'completed-only' | 'no-completed' | 'all'
export type ProgressSubtype = ProgressDataPropertiesData['track']['subtype']

export function isValidProgressItem(
	item: ItemSource<'progress'>,
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
		if ((excludedSubtypes ?? []).includes(item.system.track.subtype)) {
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
