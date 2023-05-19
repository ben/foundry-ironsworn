// export class AssetDataField extends foundry.data.fields.DataModel<any,any> {
// 	static override defineSchema(): foundry.data.fields.DataSchema<AssetDataPropertiesData> {
// 		const fields = foundry.data.fields

// 		return {
// 			category: new foundry.data.fields.StringField(),
// 			description: new foundry.data.fields.HTMLField(),
// 			requirement: new foundry.data.fields.HTMLField(),
// 			color: new foundry.data.fields.ColorField(),
// 			fields: new foundry.data.fields.ArrayField(
// 				new foundry.data.fields.SchemaField({
// 					name: new foundry.data.fields.StringField(),
// 					value: new foundry.data.fields.StringField()
// 				})
// 			),
// 			abilities: new foundry.data.fields.ArrayField(
// 				new foundry.data.fields.SchemaField({
// 					name: new foundry.data.fields.StringField(),
// 					enabled: new foundry.data.fields.BooleanField(),
// 					description: new foundry.data.fields.HTMLField(),
// 					hasClock: new foundry.data.fields.BooleanField(),
// 					clockMax: new foundry.data.fields.NumberField(),
// 					clockTicks: new foundry.data.fields.NumberField()
// 				})
// 			),
// 			track: new foundry.data.fields.SchemaField({
// 				name: new foundry.data.fields.StringField(),
// 				enabled: new foundry.data.fields.BooleanField({ initial: false }),
// 				current: new foundry.data.fields.NumberField({ integer: true, min: 0 }),
// 				max: new foundry.data.fields.NumberField({ integer: true, positive: true })
// 			}),
// 			exclusiveOptions: new foundry.data.fields.ArrayField(
// 				new foundry.data.fields.SchemaField({
// 					name: new foundry.data.fields.StringField(),
// 					selected: new foundry.data.fields.BooleanField()
// 				})
// 			),
// 			conditions: new foundry.data.fields.ArrayField(
// 				new foundry.data.fields.SchemaField({
// 					name: new foundry.data.fields.StringField(),
// 					ticked: new foundry.data.fields.BooleanField()
// 				})
// 			)
// 		}
// 	}
// }

// export class SFMoveDataField extends foundry.data.fields.DataModel<
// 	any,any
// > {
// 	static override defineSchema(): foundry.data.fields.DataSchema<SFMoveDataPropertiesData> {
// 		const fields = foundry.data.fields
// 		return {
// 			dfid: new DataforgedIDField(),
// 			Asset: new DataforgedIDField(),
// 			Name: new foundry.data.fields.StringField(),
// 			'Progress Move': new foundry.data.fields.BooleanField(),
// 			'Variant of': new DataforgedIDField(),
// 			Category: new DataforgedIDField(),
// 			Oracles: new foundry.data.fields.ArrayField(new DataforgedIDField()),
// 			Text: new foundry.data.fields.HTMLField(),
// 			Optional: new foundry.data.fields.BooleanField(),
// 			Tags: new foundry.data.fields.ArrayField(new foundry.data.fields.StringField()),
// 			Trigger: new foundry.data.fields.SchemaField({
//         Text: new foundry.data.fields.HTMLField(),
//         By: new foundry.data.fields.SchemaField({}),
//         Options: new foundry.data.fields.ArrayField(new foundry.data.fields.SchemaField({}))
//       }),
// 			Display: new foundry.data.fields.SchemaField({}),
// 			Outcomes: new foundry.data.fields.SchemaField({}),
// 			Source: new foundry.data.fields.SchemaField({}),
// 			Suggestions: new foundry.data.fields.SchemaField({})
// 		}
// 	}
// }

// export class DataforgedIDField extends foundry.data.fields.StringField {}
