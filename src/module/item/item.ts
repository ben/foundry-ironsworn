import type { ConfiguredData } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { DocumentSubTypes } from '../../types/helperTypes'
import { typedDeleteDialog } from '../helpers/util'
import type { ItemDataProperties } from './config'

/**
 * Extend the base Item entity
 * @extends {Item}
 */
export class IronswornItem<
	T extends DocumentSubTypes<'Item'> = any
> extends Item {
	// Type hacks for v10 compatibility updates
	declare system: Extract<ItemDataProperties, { type: T }>['system']
	// @ts-expect-error
	declare type: T

	declare sort: typeof this.data.sort

	/**
	 * Typeguard: is the provided value an IronswornItem instance of the specified type?
	 */
	static assert<T extends ConfiguredData<'Item'>['type']>(
		item: unknown,
		subtype: T
	): item is IronswornItem<T> {
		return item instanceof IronswornItem && item.type === subtype
	}

	/** Typeguard: is this an instance of the specified type? */
	assert<T extends ConfiguredData<'Item'>['type']>(
		subtype: T
	): this is IronswornItem<T> {
		return IronswornItem.assert(this, subtype)
	}

	static override migrateData(data: any) {
		// Migration 2: convert vows to progresses with the "vow" subtype
		if (data.type === 'vow') {
			data.system.subtype = data.type.valueOf()
			data.type = 'progress'
		}
		return super.migrateData(data)
	}

	override async deleteDialog(options: Partial<DialogOptions> = {}) {
		return await typedDeleteDialog(this, options)
	}
}
export interface IronswornItem<T extends DocumentSubTypes<'Item'> = any>
	extends Item {}

declare global {
	interface DocumentClassConfig {
		Item: typeof IronswornItem
	}
}
