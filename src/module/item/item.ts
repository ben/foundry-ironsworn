import type { ConfiguredData } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { DocumentSubTypes } from '../../types/helperTypes'
import { RANK_INCREMENTS } from '../constants'
import { getFoundryMoveByDfId } from '../dataforged'
import { IronswornPrerollDialog } from '../rolls'
import type {
	BondsetDataPropertiesData,
	ItemDataProperties,
	ProgressDataPropertiesData,
	SFMoveDataPropertiesData
} from './itemtypes'

/**
 * Extend the base Item entity
 * @extends {Item}
 */
export class IronswornItem<
	T extends DocumentSubTypes<'Item'> = DocumentSubTypes<'Item'>
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

	/**
	 * Progress methods
	 */
	async markProgress(numMarks = 1) {
		if (this.type !== 'progress') return
		const system = this.system as ProgressDataPropertiesData

		const increment = RANK_INCREMENTS[system.rank] * numMarks
		let newValue = system.current + increment
		newValue = Math.min(newValue, 40)
		newValue = Math.max(newValue, 0)
		return await this.update({ 'system.current': newValue })
	}

	async clearProgress() {
		if (this.data.type !== 'progress') return
		return await this.update({ 'system.current': 0 })
	}

	async fulfill() {
		if (this.type !== 'progress') return
		const system = this.system as ProgressDataPropertiesData

		let moveDfId: string | undefined
		if (system.subtype === 'vow') {
			const toolset = this.actor?.toolset ?? 'starforged'
			moveDfId =
				toolset === 'starforged'
					? 'Starforged/Moves/Quest/Fulfill_Your_Vow'
					: 'Ironsworn/Moves/Quest/Fulfill_Your_Vow'
		}

		const progress = Math.floor(system.current / 4)
		return await IronswornPrerollDialog.showForProgress(
			this.name ?? '(progress)',
			progress,
			this.actor ?? undefined,
			moveDfId
		)
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

	/**
	 * Move methods
	 */
	isProgressMove(): boolean | undefined {
		if (this.type !== 'sfmove') return

		const sfMoveSystem = this.system as SFMoveDataPropertiesData
		return sfMoveSystem.Trigger.Options?.some(
			(option) => option['Roll type'] === 'Progress roll'
		)
	}
}

declare global {
	interface DocumentClassConfig {
		Item: typeof IronswornItem
	}
}
