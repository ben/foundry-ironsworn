import type { ConfiguredData } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { DocumentSubTypes } from '../../types/helperTypes'
import { getFoundryMoveByDfId } from '../dataforged'
import { IronswornPrerollDialog } from '../rolls'
import type { BondsetDataPropertiesData, ItemDataProperties } from './itemtypes'

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

	// @ts-expect-error Inheritor? I hardly even know 'er!
	static override migrateData(data: any) {
		// Migration 2: convert vows to progresses with the "vow" subtype
		if (data.type === 'vow') {
			data.system.subtype = data.type.valueOf()
			data.type = 'progress'
		}
		// @ts-expect-error
		return super.migrateData(data)
	}

	/**
	 * Bondset methods
	 */

	async writeEpilogue() {
		if (this.type !== 'bondset') return
		const system = this.system as BondsetDataPropertiesData

		const move = await getFoundryMoveByDfId(
			'Ironsworn/Moves/Relationship/Write_Your_Epilogue'
		)
		if (move == null) throw new Error('Problem loading write-epilogue move')

		const progress = Math.floor(Object.values(system.bonds).length / 4)
		void IronswornPrerollDialog.showForOfficialMove(
			'Ironsworn/Moves/Relationship/Write_Your_Epilogue',
			{
				actor: this.actor ?? undefined,
				progress: {
					source: game.i18n.localize('IRONSWORN.ITEMS.TypeBond'),
					value: progress
				}
			}
		)
	}
}
export interface IronswornItem<T extends DocumentSubTypes<'Item'> = any>
	extends Item {}

declare global {
	interface DocumentClassConfig {
		Item: typeof IronswornItem
	}
}
