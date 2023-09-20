import type { IronswornActor } from '../../../actor/actor'
import { IronswornItem } from '../../../item/item'
import type { ProgressDataPropertiesData } from '../../../item/subtypes/progress'

export type CompletedProgressType = 'completed-only' | 'no-completed' | 'all'
export type ProgressSubtype =
	ProgressDataPropertiesData['progressTrack']['subtype']

export function isValidProgressItem(
	item: ItemSource | IronswornItem,
	showCompleted: CompletedProgressType,
	excludedSubtypes?: ProgressSubtype[]
): item is ItemSource<'progress'> | IronswornItem<'progress'> {
	if (item.type === 'progress') {
		const progress = item as ItemSource<'progress'> | IronswornItem<'progress'>
		switch (showCompleted) {
			case 'completed-only': {
				if (!progress.system.completed) {
					return false
				}
				break
			}
			case 'no-completed': {
				if (progress.system.completed) {
					return false
				}
				break
			}
			default:
				break
		}
		if (
			(excludedSubtypes ?? []).includes(progress.system.progressTrack?.subtype)
		) {
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
		.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) as any[]
	return items ?? []
}
