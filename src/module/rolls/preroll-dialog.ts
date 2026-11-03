import type {
	DFProgressTypeIronsworn,
	DFRollMethod,
	DFRollType
} from '../item/types'
import { cloneDeep, maxBy, minBy, sortBy } from 'lodash-es'
import { IronswornActor } from '../actor/actor'
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
import { IronswornHandlebarsHelpers } from '../helpers/handlebars'
import { getFoundryMoveByDsId } from '../datasworn2'
import type { NextMoveBonus } from '../actor/subtypes/character'

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
		'supply',
		'hold'
	]
	return actionOptions.filter((x) =>
		(x.Using as string[]).every((u) => allowedUsings.includes(u.toLowerCase()))
	)
}

export function moveTriggerIsRollable(trigger?: SFMoveTrigger): boolean {
	return !!trigger && rollableOptions(trigger).length > 0
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
	mode: DFRollMethod,
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

interface NextMoveBonusGroup {
	actorId: string
	bonuses: Array<NextMoveBonus & { label: string }>
}

/**
 * Lists each character's pending next-move bonuses for the roll dialog,
 * ticked. Characters without any are left out. Action rolls only: a progress
 * roll takes no adds, and the bonus is "not a progress move".
 */
function nextMoveBonusGroups(
	actors: Array<IronswornActor | null | undefined>
): NextMoveBonusGroup[] {
	const groups: NextMoveBonusGroup[] = []
	for (const actor of actors) {
		if (!IronswornActor.assert(actor, 'character')) continue
		const bonuses = actor.system.nextMoveBonuses ?? []
		if (bonuses.length === 0 || actor.id == null) continue
		groups.push({
			actorId: actor.id,
			bonuses: bonuses.map((bonus) => ({
				...bonus,
				label: `${bonus.value >= 0 ? '+' : ''}${bonus.value} ${
					bonus.source || game.i18n.localize('IRONSWORN.NextMoveBonus.Unnamed')
				}`
			}))
		})
	}
	return groups
}

/**
 * The next-move bonuses ticked in the roll dialog. When the dialog lets you
 * pick the character, only that character's bonuses count.
 */
function checkedNextMoveBonuses(
	form: HTMLFormElement
): Array<{ actorId: string; id: string; source: string; value: number }> {
	const selectedActorId = (
		form.elements.namedItem('char') as HTMLSelectElement | null
	)?.value
	return Array.from(
		form.querySelectorAll<HTMLInputElement>('input[data-next-move-bonus]')
	)
		.filter((el) => el.checked)
		.filter((el) => !selectedActorId || el.dataset.actorId === selectedActorId)
		.map((el) => ({
			actorId: el.dataset.actorId ?? '',
			id: el.value,
			source:
				el.dataset.source ||
				game.i18n.localize('IRONSWORN.NextMoveBonus.Unnamed'),
			value: Number(el.dataset.value ?? 0)
		}))
}

function prerollOptionsWithFormData(
	form: HTMLFormElement,
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

	const formData = new FormData(form)
	const valMap: ValueMap = {}
	for (const [name, value] of formData.entries()) {
		const str = value as string
		if (isSet(str)) {
			valMap[name] = parseInt(str, 10)
		}
	}

	opts.adds = valMap.adds

	const bonuses = checkedNextMoveBonuses(form)
	opts.bonuses =
		bonuses.length > 0
			? bonuses.map(({ source, value }) => ({ source, value }))
			: undefined

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

const { ApplicationV2, DialogV2 } = foundry.applications.api

export class IronswornPrerollDialog extends DialogV2 {
	prerollOptions: PreRollOptions = {}

	constructor(pro: PreRollOptions, config: object) {
		super(config)
		this.prerollOptions = pro
	}

	static get DEFAULT_OPTIONS() {
		return {
			classes: ['ironsworn', 'dialog'],
			position: { width: 500 }
		}
	}

	_onRender(_context: object, _options: object): void {
		const element = this.element as HTMLElement

		// Resize when expanding the "advanced" section
		element.querySelector('details')?.addEventListener('toggle', (ev) => {
			const target = ev.currentTarget as HTMLDetailsElement
			const delta = (target.open ? 1 : -1) * 160
			const pos = (this as any).position
			;(this as any).setPosition({ height: (pos.height ?? 0) + delta })
		})

		// Re-render the graphic when controls change
		const form = element.querySelector('form') as HTMLFormElement
		const rerender = async () => {
			const pro = prerollOptionsWithFormData(form, this.prerollOptions)
			const graphic = await renderRollGraphic({ preRollOptions: pro })
			element.querySelector('.roll-graphic')?.replaceWith(
				document.createRange().createContextualFragment(graphic)
			)
		}
		// Only show the selected character's next-move bonuses
		const showBonusesForSelectedActor = () => {
			const select = form.elements.namedItem('char') as HTMLSelectElement | null
			element
				.querySelectorAll<HTMLElement>('.next-move-bonuses[data-actor-id]')
				.forEach((el) => {
					el.hidden = select != null && el.dataset.actorId !== select.value
				})
		}
		showBonusesForSelectedActor()
		element
			.querySelector('select[name="char"]')
			?.addEventListener('change', showBonusesForSelectedActor)
		void rerender()

		element.querySelectorAll('input').forEach((el) => el.addEventListener('change', rerender))
		element.querySelectorAll('select').forEach((el) => el.addEventListener('change', rerender))
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

		const rollingActor =
			document instanceof IronswornActor ? document : document.parent
		const content = await this.renderContent({
			prerollOptions,
			action: true,
			nextMoveBonusGroups: nextMoveBonusGroups([rollingActor])
		})

		return new IronswornPrerollDialog(prerollOptions, {
			window: { title },
			content,
			buttons: [
				{
					action: dataforgedStat,
					label: statData.source,
					icon: 'isicon-d10-tilt juicy',
					default: true,
					callback: async (_ev: Event, button: HTMLButtonElement) => {
						void IronswornPrerollDialog.submitRoll(button.form!, prerollOptions)
					}
				}
			]
		}).render({ force: true })
	}

	static async showForProgress(
		name: string,
		value: number,
		actor?: IronswornActor<any>,
		moveDsId?: string
	) {
		const rollText = game.i18n.localize('IRONSWORN.ProgressRoll')
		let title = `${rollText}: ${name}`

		let move: IronswornItem<'sfmove'> | undefined
		if (moveDsId != null) {
			move = await getFoundryMoveByDsId(moveDsId)
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
			moveDsId
		}

		const content = await this.renderContent({
			prerollOptions,
			move
		})

		return new IronswornPrerollDialog(prerollOptions, {
			window: { title },
			content,
			buttons: [
				{
					action: 'roll',
					label: game.i18n.localize('IRONSWORN.Roll'),
					icon: 'isicon-d10-tilt juicy',
					default: true,
					callback: async (_ev: Event, button: HTMLButtonElement) => {
						void IronswornPrerollDialog.submitRoll(button.form!, prerollOptions)
					}
				}
			]
		}).render({ force: true })
	}

	static async showForOfficialMove(moveDsId: string, opts?: showForMoveOpts) {
		const moveItem = await getFoundryMoveByDsId(moveDsId)
		if (moveItem == null) {
			throw new Error(`Couldn't find item for move '${moveDsId}'`)
		}

		return await this.showForMoveItem(
			moveItem,
			{ moveDsId, progress: opts?.progress },
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
				'Roll type': 'Progress roll' as DFRollType,
				Method: 'Any' as DFRollMethod,
				Using: ['Progress' as DFProgressTypeIronsworn]
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
			action: true,
			nextMoveBonusGroups:
				prerollOptions.progress == null ? nextMoveBonusGroups(allActors) : []
		})

		const buttons = options.map((option, i) => {
			const stats = option.Using as string[]
			const mode = option.Method as DFRollMethod
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

			return {
				action: i.toString(),
				label,
				icon: 'isicon-d10-tilt juicy',
				default: i === 0,
				callback: (_ev: Event, button: HTMLButtonElement) => {
					const form = button.form!
					let rollingActor: IronswornActor<'character'>
					if (allActors.length === 1) {
						rollingActor = allActors[0]
					} else {
						const actorId = (form.elements.namedItem('char') as HTMLSelectElement).value
						rollingActor = game.actors?.get(actorId) as IronswornActor<'character'>
					}

					prerollOptions.momentum = rollingActor.system.momentum.value
					prerollOptions.stat = chooseStatToRoll(mode, stats, rollingActor)

					void IronswornPrerollDialog.submitRoll(form, prerollOptions)
				}
			}
		})

		return new IronswornPrerollDialog(prerollOptions, {
			window: { title },
			content,
			buttons
		}).render({ force: true })
	}

	private static async submitRoll(
		form: HTMLFormElement,
		opts: PreRollOptions
	) {
		const realOpts = prerollOptionsWithFormData(form, opts)
		const spentBonuses = checkedNextMoveBonuses(form)

		const r = new IronswornRoll(realOpts)
		const msg = new IronswornRollMessage(r)
		await msg.createOrUpdate()

		// The roll has been made, so its ticked next-move bonuses are spent
		const spender = game.actors?.get(spentBonuses[0]?.actorId ?? '')
		if (IronswornActor.assert(spender, 'character')) {
			await spender.system.removeNextMoveBonuses(spentBonuses.map((x) => x.id))
		}
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
		nextMoveBonusGroups?: NextMoveBonusGroup[]
	}): Promise<string> {
		const graphic = await renderRollGraphic({
			preRollOptions: data.prerollOptions
		})
		let renderedTriggerText = data.move?.system?.Trigger?.Text
		if (renderedTriggerText)
			renderedTriggerText = await IronswornHandlebarsHelpers.enrichMarkdown(
				renderedTriggerText
			)
		const advancedOptionsOpen = IronswornSettings.get(
			'advanced-rolling-default-open'
		)
		const template =
			'systems/foundry-ironsworn/templates/rolls/preroll-dialog.hbs'
		return await foundry.applications.handlebars.renderTemplate(template, {
			...data,
			renderedTriggerText,
			graphic,
			advancedOptionsOpen
		})
	}
}
