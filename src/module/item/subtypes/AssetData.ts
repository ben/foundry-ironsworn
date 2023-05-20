// import type { DataSchema } from '../../fields/utils'
// import type { IronswornItem } from '../item'
// import type {
// 	AssetAbility,
// 	AssetDataSourceData,
// 	AssetExclusiveOption,
// 	AssetCondition,
// 	AssetField
// } from '../itemtypes'

// export class AssetData extends foundry.abstract.DataModel<
// 	DataSchema<AssetDataSourceData>,
// 	IronswornItem<'asset'>
// > {
// 	static override defineSchema() {
// 		const fields = foundry.data.fields

// 		return {
// 			category: new fields.StringField(),
// 			description: new fields.HTMLField({ nullable: true, required: false }),
// 			requirement: new fields.HTMLField(),
// 			color: new fields.ColorField(),
// 			fields: new fields.ArrayField(new AssetFieldField()),
// 			abilities: new fields.ArrayField(new AssetAbilityField()),
// 			track: new ConditionMeterField(),
// 			exclusiveOptions: new fields.ArrayField(new AssetExclusiveOptionField()),
// 			conditions: new fields.ArrayField(new AssetConditionField())
// 		}
// 	}
// }

// export class AssetFieldField extends foundry.data.fields.SchemaField<
// 	DataSchema<AssetField>
// > {
// 	constructor() {
// 		const fields = foundry.data.fields
// 		super({
// 			name: new fields.StringField(),
// 			value: new fields.StringField()
// 		})
// 	}
// }

// export class AssetExclusiveOptionField extends foundry.data.fields.SchemaField<
// 	DataSchema<AssetExclusiveOption>
// > {
// 	constructor() {
// 		const fields = foundry.data.fields
// 		super({
// 			name: new fields.StringField(),
// 			selected: new fields.BooleanField()
// 		})
// 	}
// }

// export class AssetConditionField extends foundry.data.fields.SchemaField<
// 	DataSchema<AssetCondition>
// > {
// 	constructor() {
// 		const fields = foundry.data.fields
// 		super({
// 			name: new fields.StringField(),
// 			ticked: new fields.BooleanField()
// 		})
// 	}
// }

// export class AssetAbilityField extends foundry.data.fields.SchemaField<
// 	DataSchema<AssetAbility>
// > {
// 	constructor() {
// 		const fields = foundry.data.fields
// 		super({
// 			name: new fields.StringField({ required: false, nullable: true }),
// 			enabled: new fields.BooleanField(),
// 			description: new fields.HTMLField(),
// 			hasClock: new fields.BooleanField(),
// 			clockMax: new fields.NumberField(),
// 			clockTicks: new fields.NumberField()
// 		})
// 	}
// }

// export class ConditionMeterField extends foundry.data.fields.SchemaField<
// 	DataSchema<AssetDataSourceData['track']>
// > {
// 	constructor() {
// 		const fields = foundry.data.fields
// 		super({
// 			name: new fields.StringField(),
// 			enabled: new fields.BooleanField(),
// 			current: new fields.NumberField(),
// 			max: new fields.NumberField()
// 		})
// 	}
// }
