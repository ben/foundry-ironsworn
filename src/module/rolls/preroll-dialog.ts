import type {
	PlayerConditionMeter,
	ProgressTypeIronsworn,
	RollableStat,
	RollMethod,
	RollType,
	Stat
} from 'dataforged'
import { cloneDeep, maxBy, minBy, sortBy } from 'lodash-es'
import { IronswornActor } from '../actor/actor'
import { getFoundryMoveByDfId } from '../dataforged'
import { IronswornItem } from '../item/item'
import type {
	PreRollOptions,
	RollOutcome,
	SourcedValue
} from './ironsworn-roll'
import { IronswornRoll } from './ironsworn-roll'
import { renderRollGraphic } from './roll-graphic'
import { IronswornRollMessage } from '.'
import { formatRollPlusStat } from './ironsworn-roll-message.js'
import { ChallengeResolutionDialog } from './challenge-resolution-dialog'
import type { SFMoveTrigger } from '../item/subtypes/sfmove'
import type { ConditionMeterSource } from '../fields/MeterField'
import { ConditionMeterField } from '../fields/MeterField'
import type { AssetConditionMeter } from '../item/subtypes/asset'
import { AssetConditionMeterField } from '../item/subtypes/asset'
import { IronswornSettings } from '../helpers/settings'

interface showForMoveOpts {
	actor?: IronswornActor
	progress?: SourcedValue
}

export function localeCapitalize(str: string) {
	const locale = game.i18n.lang
	return str[0].toLocaleUpperCase(locale) + str.slice(1)
}

function rollableOptions(trigger: SFMoveTrigger) {
	if (trigger.Options == null) return []

	const actionOptions = trigger.Options.filter(
		(x) => x['Roll type'] === 'Action roll'
	)
	if (actionOptions.length === 0) return []

	const allowedUsings = [
		'edge',
		'iron',
		'heart',
		'shadow',
		'wits',
		'health',
		'spirit',
		'supply'
	]
	return actionOptions.filter((x) =>
		(x.Using as string[]).every((u) => allowedUsings.includes(u.toLowerCase()))
	)
}

export function moveHasRollableOptions(move: IronswornItem<'sfmove'>) {
	if (!move.assert('sfmove')) return false
	const options = rollableOptions(move.system.Trigger)
	return options.length > 0
}

export function getStatData(
	attr: string,
	document:
		| IronswornActor<'character'>
		| IronswornActor<'starship'>
		| IronswornActor<'shared'>
		| IronswornItem<'asset'>,
	appendNameToLabel = false
): SourcedValue<number> | undefined {
	const key = attr.toLowerCase()
	if (key === 'progress') return undefined

	let source: string
	let value: number

	const field = document.system.schema.getField(key) as
		| foundry.data.fields.NumberField
		| ConditionMeterField
		| AssetConditionMeterField

	if (field == null) return undefined

	if (field instanceof ConditionMeterField) {
		const data = document.system[key] as ConditionMeterSource
		source = field.label
		value = data.value
	} else if (field instanceof AssetConditionMeterField) {
		const data = document.system[key] as AssetConditionMeter
		source = data.name
		value = data.value
	} else {
		source = field.label
		value = document.system[key]
	}

	if (source == null || value == null) return undefined

	if (source.startsWith('IRONSWORN.')) source = game.i18n.localize(source)

	if (appendNameToLabel && document.name != null)
		source += ` (${document.name})`

	return { source, value }
}

function chooseStatToRoll(
	mode: RollMethod,
	stats: string[],
	actor: IronswornActor<'character'> | IronswornActor<'starship'>
): SourcedValue | undefined {
	const normalizedStats = stats.map((x) => x.toLowerCase())
	let stat = normalizedStats[0]

	// Progress roll -> no stat
	if (stat === 'progress') return undefined

	if (mode === 'Highest' || mode === 'Lowest') {
		const statMap = {}
		for (const x of normalizedStats) {
			statMap[x] = actor.system[x].value ?? actor.system[x]
		}
		const fn = mode === 'Highest' ? maxBy : minBy
		stat = fn(Object.keys(statMap), (x) => statMap[x]) ?? stats[0]
	} else if (mode !== 'Any') {
		// TODO: 'all of'
		throw new Error(`Cannot handle rolling with '${mode}' mode`)
	}

	return getStatData(stat, actor)
}

/**
 * Parses a checkbox form element value into a boolean.
 * @param value the checkbox value to be parsed
 */
function parseCheckbox(value?: string) {
	switch (value) {
		case 'on':
			return true
		case 'off':
		default:
			return false
	}
}

function prerollOptionsWithFormData(
	form: JQuery<HTMLFormElement>,
	base: PreRollOptions
): PreRollOptions {
	const opts = cloneDeep(base)
	type ValueMap = Record<string, boolean | number> & {
		adds?: number
		automaticOutcomeValue?: number
		extraChallengeDiceValue?: number
		presetActionDieValue?: number
		presetChallengeDie1Value?: number
		presetChallengeDie2Value?: number
	}

	const isSet = (x) =>
		x !== null && x !== 'null' && x !== undefined && !isNaN(x) && x !== ''

	const valMap: ValueMap = form
		.serializeArray()
		.reduce((coll, { name, value }) => {
			if (isSet(value)) {
				coll[name] = parseInt(value, 10)
			}
			return coll
		}, {})

	opts.adds = valMap.adds

	if (isSet(valMap.automaticOutcomeValue)) {
		opts.automaticOutcome = {
			source: 'set manually',
			value: valMap.automaticOutcomeValue as RollOutcome
		}
	}
	if (isSet(valMap.presetActionDieValue)) {
		opts.presetActionDie = {
			source: 'set manually',
			value: valMap.presetActionDieValue as number
		}
	}
	if (isSet(valMap.presetChallengeDie1Value)) {
		opts.presetChallenge1 = {
			source: 'set manually',
			value: valMap.presetChallengeDie1Value as number
		}
	}
	if (isSet(valMap.presetChallengeDie2Value)) {
		opts.presetChallenge2 = {
			source: 'set manually',
			value: valMap.presetChallengeDie2Value as number
		}
	}
	if (isSet(valMap.extraChallengeDiceValue)) {
		opts.extraChallengeDice = {
			source: 'set manually',
			value: valMap.extraChallengeDiceValue as number
		}
	}
	return opts
}

export class IronswornPrerollDialog extends Dialog<
	PreRollOptions & DialogOptions
> {
	prerollOptions: PreRollOptions = {}

	constructor(
		pro: PreRollOptions,
		data: Dialog.Data,
		options?: Partial<DialogOptions>
	) {
		super(data, options)
		this.prerollOptions = pro
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['ironsworn', 'dialog'],
			width: 500
		})
	}

	static async showForStat(
		...[dataforgedStat, document, appendNameToLabel]: Parameters<
			typeof getStatData
		>
	) {
		const statData = getStatData(dataforgedStat, document, appendNameToLabel)
		if (statData == null) return

		const title = formatRollPlusStat(statData.source)

		const prerollOptions: PreRollOptions = {
			stat: statData,
			actorId:
				document instanceof IronswornActor
					? (document.id as string)
					: document instanceof IronswornItem
					? (document.parent?.id as string)
					: undefined
		}

		const content = await this.renderContent({
			prerollOptions,
			action: true
		})
		const buttons = {
			[dataforgedStat]: {
				label: `<span class="button-text">${statData.source}</span>`,
				icon: '<i class="isicon-d10-tilt juicy"></i>',
				callback: async (el: HTMLElement | JQuery<HTMLElement>) => {
					void IronswornPrerollDialog.submitRoll(el, prerollOptions)
				}
			}
		}
		return new IronswornPrerollDialog(prerollOptions, {
			title,
			content,
			buttons,
			default: dataforgedStat
		}).render(true)
	}

	static async showForProgress(
		name: string,
		value: number,
		actor?: IronswornActor<any>,
		moveDfId?: string
	) {
		const rollText = game.i18n.localize('IRONSWORN.ProgressRoll')
		let title = `${rollText}: ${name}`

		let move: IronswornItem<'sfmove'> | undefined
		if (moveDfId != null) {
			move = await getFoundryMoveByDfId(moveDfId)
			if (move?.name != null) {
				title = `${move.name}: ${name}`
			}
		}

		const prerollOptions: PreRollOptions = {
			progress: {
				source: name,
				value
			},

			actorId: actor?.id ?? undefined,
			moveDfId
		}

		const content = await this.renderContent({ prerollOptions, move })
		const buttons = {
			[name]: {
				label: `<span class=button-text>${game.i18n.localize(
					'IRONSWORN.Roll'
				)}</span>`,
				icon: '<i class="isicon-d10-tilt juicy"></i>',
				callback: async (el: HTMLElement | JQuery<HTMLElement>) => {
					void IronswornPrerollDialog.submitRoll(el, prerollOptions)
				}
			}
		}
		return new IronswornPrerollDialog(prerollOptions, {
			title,
			content,
			buttons,
			default: name
		}).render(true)
	}

	static async showForOfficialMove(moveDfId: string, opts?: showForMoveOpts) {
		const moveItem = await getFoundryMoveByDfId(moveDfId)
		if (moveItem == null) {
			throw new Error(`Couldn't find item for move '${moveDfId}'`)
		}

		return await this.showForMoveItem(
			moveItem,
			{ moveDfId, progress: opts?.progress },
			opts
		)
	}

	static async showForMove(
		move: IronswornItem<'sfmove'>,
		opts?: showForMoveOpts
	) {
		if (move.type !== 'sfmove') {
			throw new Error('this only works with SF moves')
		}

		return await this.showForMoveItem(
			move,
			{
				moveId: move.id ?? undefined,
				progress: opts?.progress
			},
			opts
		)
	}

	private static async showForMoveItem(
		move: IronswornItem<'sfmove'>,
		prerollOptions: PreRollOptions,
		opts?: showForMoveOpts
	) {
		prerollOptions.actorId = opts?.actor?.id ?? undefined

		const options = rollableOptions(move.system.Trigger)
		if (options.length === 0) {
			if (prerollOptions.progress == null)
				throw new Error(
					`Move '${move.name as string}' (${JSON.stringify(
						prerollOptions
					)}) is not rollable`
				)

			// Add this so it generates a button, but it won't be passed to
			// the IronswornRoll object as a stat
			options.push({
				'Roll type': 'Progress roll' as RollType,
				Method: 'Any' as RollMethod,
				Using: ['Progress' as ProgressTypeIronsworn]
			})
		}

		const title = move.name ?? 'MOVE'
		const allActors = [] as Array<IronswornActor<'character'>>
		if (opts?.actor?.type === 'character') {
			allActors.push(opts.actor)
		} else {
			allActors.push(
				...sortBy(
					game.actors?.filter((x) => x.type === 'character') as any,
					'name'
				)
			)
		}
		const showActorSelect = allActors.length > 1

		const content = await this.renderContent({
			prerollOptions,
			move,
			actor: opts?.actor,
			allActors,
			showActorSelect,
			action: true
		})
		const buttons = {}
		const addButton = (i: number, mode: RollMethod, stats: string[]) => {
			const localizedStats = stats.map((s) =>
				game.i18n.localize(`IRONSWORN.${s.capitalize()}`)
			)

			let label = localizedStats[0]
			if (mode !== 'Any') {
				label = game.i18n.format(
					`IRONSWORN.PreRollMethod.${mode.capitalize()}`,
					{
						statList: localizedStats.join(', ')
					}
				)
			}

			buttons[i.toString()] = {
				// use the below instead as a silly method for sneaking classes in
				// buttons[
				//   kebabCase(label) + ' clickable isicon-d10-tilt juicy icon-button'
				// ] = {
				label: `<span class=button-text>${label}</span>`,
				icon: '<i class="isicon-d10-tilt juicy"></i>',
				callback: (el: JQuery<HTMLElement>) => {
					let rollingActor: IronswornActor<'character'>
					if (allActors.length === 1) {
						rollingActor = allActors[0]
					} else {
						// Get the selected actor from the dialog
						const actorId = el.find('#char').val() as string
						rollingActor = game.actors?.get(
							actorId
						) as IronswornActor<'character'>
					}

					// Set up for the roll
					prerollOptions.momentum = rollingActor.system.momentum.value
					prerollOptions.stat = chooseStatToRoll(mode, stats, rollingActor)

					void IronswornPrerollDialog.submitRoll(el, prerollOptions)
				}
			}
		}

		for (let i = 0; i < options.length; i++) {
			const option = options[i]
			addButton(i, option.Method, option.Using)
		}

		return new IronswornPrerollDialog(prerollOptions, {
			title,
			content,
			buttons,
			default: '0'
		}).render(true)
	}

	private static async submitRoll(
		el: HTMLElement | JQuery<HTMLElement>,
		opts: PreRollOptions
	) {
		const realOpts = prerollOptionsWithFormData($(el).find('form'), opts)

		const r = new IronswornRoll(realOpts)
		const msg = new IronswornRollMessage(r)
		await msg.createOrUpdate()
		await new Promise((r) => setTimeout(r, 50))

		// Show resolution dialog if needed
		if (r.preRollOptions.extraChallengeDice != null) {
			void ChallengeResolutionDialog.showForMessage(
				msg.roll.chatMessageId ?? ''
			)
		}
	}

	private static async renderContent(data: {
		prerollOptions: PreRollOptions
		move?: IronswornItem<'sfmove'>
		actor?: IronswornActor<'character'>
		allActors?: IronswornActor[]
		showActorSelect?: boolean
		action?: boolean
	}): Promise<string> {
		const graphic = await renderRollGraphic({
			preRollOptions: data.prerollOptions
		})
		const advancedOptionsOpen = IronswornSettings.get(
			'advanced-rolling-default-open'
		)
		const template =
			'systems/foundry-ironsworn/templates/rolls/preroll-dialog.hbs'
		return await renderTemplate(template, {
			...data,
			graphic,
			advancedOptionsOpen
		})
	}

	activateListeners(html: JQuery<HTMLElement>): void {
		super.activateListeners(html)

		// Resize when expanding the "advanced" section
		html.find('details').on('toggle', (ev) => {
			const delta = (ev.currentTarget.open ? 1 : -1) * 160
			const app = html.parents('.app')
			app.height((app.height() ?? 0) + delta)
		})

		// Re-render the graphic when controls change
		const rerender = async () => {
			const pro = prerollOptionsWithFormData(
				this.element.find('form'),
				this.prerollOptions
			)
			const graphic = await renderRollGraphic({ preRollOptions: pro })
			this.element.find('.roll-graphic').replaceWith(graphic)
		}
		html.find('input').on('change', rerender)
		html.find('select').on('change', rerender)
	}
}
