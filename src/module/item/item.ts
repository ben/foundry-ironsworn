import type { ConfiguredData } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { DocumentSubTypes } from '../../types/helperTypes'
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
}

declare global {
	interface DocumentClassConfig {
		Item: typeof IronswornItem
	}
}
