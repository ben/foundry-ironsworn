import '../../types/data/TypeDataField'
import { IronswornActor } from './actor'
import {
	CharacterDataProperties,
	CharacterDataPropertiesData,
	SiteDataPropertiesData
} from './actortypes'

const TypeDataField = (foundry.data.fields as any).TypeDataField

export class CharacterDataField extends TypeDataField {
	static defineSchema(): Record<keyof CharacterDataPropertiesData, any> {
		const fields = foundry.data.fields as any
		return {
			biography: new fields.HTMLField(),
			notes: new fields.HTMLField(),

			edge: new fields.NumberField({
				integer: true,
				required: true,
				initial: 1,
				min: 0,
				max: 4
			}),
			heart: new fields.NumberField({
				integer: true,
				required: true,
				initial: 1,
				min: 0,
				max: 4
			}),
			iron: new fields.NumberField({
				integer: true,
				required: true,
				initial: 1,
				min: 0,
				max: 4
			}),
			shadow: new fields.NumberField({
				integer: true,
				required: true,
				initial: 1,
				min: 0,
				max: 4
			}),
			wits: new fields.NumberField({
				integer: true,
				required: true,
				initial: 1,
				min: 0,
				max: 4
			}),

			health: new fields.NumberField({
				integer: true,
				required: true,
				min: 5,
				max: 5,
				initial: 5
			}),
			spirit: new fields.NumberField({
				integer: true,
				required: true,
				min: 5,
				max: 5,
				initial: 5
			}),
			supply: new fields.NumberField({
				integer: true,
				required: true,
				min: 5,
				max: 5,
				initial: 5
			}),

			momentum: new fields.NumberField({
				integer: true,
				required: true,
				initial: 2
			}),
			momentumReset: new fields.NumberField({
				integer: true,
				required: true,
				initial: 2
			}),
			momentumMax: new fields.NumberField({
				integer: true,
				required: true,
				initial: 10
			}),

			experience: new fields.NumberField({
				integer: true,
				required: true,
				initial: 0
			}),
			xp: new fields.NumberField({
				integer: true,
				required: true,
				initial: 0
			}),

			debility: new fields.SchemaField({
				corrupted: new fields.BooleanField({ initial: false, required: true }),
				cursed: new fields.BooleanField({ initial: false, required: true }),
				encumbered: new fields.BooleanField({ initial: false, required: true }),
				maimed: new fields.BooleanField({ initial: false, required: true }),
				shaken: new fields.BooleanField({ initial: false, required: true }),
				tormented: new fields.BooleanField({ initial: false, required: true }),
				unprepared: new fields.BooleanField({ initial: false, required: true }),
				wounded: new fields.BooleanField({ initial: false, required: true }),
				permanentlyharmed: new fields.BooleanField({
					initial: false,
					required: true
				}),
				traumatized: new fields.BooleanField({
					initial: false,
					required: true
				}),
				doomed: new fields.BooleanField({ initial: false, required: true }),
				indebted: new fields.BooleanField({ initial: false, required: true }),
				battered: new fields.BooleanField({ initial: false, required: true }),

				custom1: new fields.BooleanField({ initial: false, required: true }),
				custom1name: new fields.StringField({}),
				custom2: new fields.BooleanField({ initial: false, required: true }),
				custom2name: new fields.StringField({})
			}),

			legacies: new fields.SchemaField({
				quests: new fields.NumberField({ initial: 0, required: true }),
				questsXpSpent: new fields.NumberField({ initial: 0, required: true }),
				bonds: new fields.NumberField({ initial: 0, required: true }),
				bondsXpSpent: new fields.NumberField({ initial: 0, required: true }),
				discoveries: new fields.NumberField({ initial: 0, required: true }),
				discoveriesXpSpent: new fields.NumberField({
					initial: 0,
					required: true
				})
			})
		}
	}
}

export class SiteDataField extends TypeDataField {
	static defineSchema(): Record<keyof SiteDataPropertiesData, any> {
		const fields = foundry.data.fields as any
		return {
			current
		}
	}
}
