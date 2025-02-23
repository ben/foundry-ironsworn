/* eslint-disable @typescript-eslint/no-extraneous-class */
import { kebabCase, mapValues } from 'lodash-es'
import type { IronswornActor } from '../actor/actor.js'
import { FirstStartDialog } from '../applications/firstStartDialog'
import { SFSettingTruthsDialogVue } from '../applications/vueSfSettingTruthsDialog.js'
import * as IronColor from '../features/ironcolor'
import * as IronTheme from '../features/irontheme'

export type DataswornRulesetKey =
	| 'classic'
	| 'delve'
	| 'starforged'
	| 'sundered_isles'
export const RULESETS: DataswornRulesetKey[] = [
	'classic',
	'delve',
	'starforged',
	'sundered_isles'
]

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace ClientSettings {
		/** Settings added here will be automatically typed throughout the game system. */
		interface Values {
			'foundry-ironsworn.toolbox':
				| 'ironsworn'
				| 'starforged'
				| 'sunderedisles'
				| 'sheet'
				| 'migrated'

			'foundry-ironsworn.ruleset-classic': boolean
			'foundry-ironsworn.ruleset-delve': boolean
			'foundry-ironsworn.ruleset-starforged': boolean
			'foundry-ironsworn.ruleset-sundered_isles': boolean

			'foundry-ironsworn.theme': keyof typeof IronTheme.THEMES
			'foundry-ironsworn.color-scheme': 'zinc' | 'phosphor' | 'oceanic'
			'foundry-ironsworn.progress-mark-animation': boolean

			'foundry-ironsworn.log-changes': boolean
			'foundry-ironsworn.show-first-start-dialog': boolean

			'foundry-ironsworn.shared-supply': boolean

			'foundry-ironsworn.advanced-rolling-default-open': boolean

			'foundry-ironsworn.character-hold': boolean
			'foundry-ironsworn.dsn-cinder-wraith': boolean

			// Internal only
			'foundry-ironsworn.first-run-tips-shown': boolean
			'foundry-ironsworn.data-version': number
		}
	}
}

export class IronswornSettings {
	/**
	 * Returns CSS classes for the current theme and color scheme.
	 */
	static get classes() {
		return [
			`${IronTheme.PREFIX}${kebabCase(IronswornSettings.get('theme'))}`,
			`${IronColor.PREFIX}${kebabCase(IronswornSettings.get('color-scheme'))}`
		]
	}

	/**
	 * Returns an object that represents the current theme.
	 */
	static get theme() {
		return IronTheme.THEMES[IronswornSettings.get('theme')]
	}

	/**
	 * Shorthand getter for the current theme's decorations.
	 */
	static get deco() {
		return IronswornSettings.theme.decoration
	}

	static registerSettings() {
		game.settings.registerMenu('foundry-ironsworn', 'first-start-dialog', {
			name: 'IRONSWORN.Settings.ConfigurationDialog.Name',
			label: 'IRONSWORN.Settings.ConfigurationDialog.Label',
			icon: 'fas fa-cog',
			hint: 'IRONSWORN.Settings.ConfigurationDialog.Hint',
			type: FirstStartDialog,
			restricted: true
		})

		// Toolbox/ruleset. this goes at the top because it's a "showstopper" if folks need it but can't find it.
		// Legacy toolbox selection. This has been converted to individual rulesets below
		game.settings.register('foundry-ironsworn', 'toolbox', {
			scope: 'world',
			config: false,
			type: String,
			choices: {
				sheet: 'IRONSWORN.Settings.Tools.Sheet',
				ironsworn: 'IRONSWORN.Ironsworn',
				starforged: 'IRONSWORN.Starforged',
				sunderedisles: 'IRONSWORN.SunderedIsles',
				migrated: 'MIGRATED'
			},
			default: 'migrated'
		})

		// Ruleset selection, one for each supported ruleset
		for (const key of RULESETS) {
			game.settings.register('foundry-ironsworn', `ruleset-${key}`, {
				scope: 'world',
				config: false,
				type: Boolean,
				default: key === 'classic'
			})
		}

		// Appearance settings. They're impactful and not especially esoteric/technical, so they come next.
		game.settings.register('foundry-ironsworn', 'theme', {
			name: 'IRONSWORN.Settings.Theme.Name',
			hint: 'IRONSWORN.Settings.Theme.Hint',
			scope: 'world',
			config: true,
			type: String,
			choices: mapValues(IronTheme.THEMES, (v) => v.labelKey),
			default: 'ironsworn',
			requiresReload: true
		})
		game.settings.register('foundry-ironsworn', 'color-scheme', {
			name: 'IRONSWORN.Settings.ColorScheme.Name',
			hint: 'IRONSWORN.Settings.ColorScheme.Hint',
			scope: 'client',
			config: true,
			type: String,
			choices: {
				zinc: 'IRONSWORN.Settings.ColorScheme.Zinc',
				phosphor: 'IRONSWORN.Settings.ColorScheme.Phosphor',
				oceanic: 'IRONSWORN.Settings.ColorScheme.Oceanic'
			},
			default: 'zinc',
			onChange: IronColor.updateColorScheme
			// TODO: special behaviour for e.g. PopOut module?
		})
		game.settings.register('foundry-ironsworn', 'progress-mark-animation', {
			name: 'IRONSWORN.Settings.ProgressMarkAnimation.Name',
			hint: 'IRONSWORN.Settings.ProgressMarkAnimation.Hint',
			scope: 'client',
			type: Boolean,
			default: true,
			config: true,
			requiresReload: true
		})

		// Log verbosity and missed prompts come next.
		game.settings.register('foundry-ironsworn', 'log-changes', {
			name: 'IRONSWORN.Settings.LogChanges.Name',
			hint: 'IRONSWORN.Settings.LogChanges.Hint',
			scope: 'world',
			config: true,
			type: Boolean,
			default: true
		})
		game.settings.register('foundry-ironsworn', 'show-first-start-dialog', {
			name: 'IRONSWORN.Settings.PromptTruths.Name',
			hint: 'IRONSWORN.Settings.PromptTruths.Hint',
			scope: 'world',
			config: true,
			type: Boolean,
			default: true
		})

		// Changing the supply rule represents a divergence from the ruleset; as 'advanced' behavior it can tolerate living at the end of the list.
		game.settings.register('foundry-ironsworn', 'shared-supply', {
			name: 'IRONSWORN.Settings.SharedSupply.Name',
			hint: 'IRONSWORN.Settings.SharedSupply.Hint',
			scope: 'world',
			config: true,
			type: Boolean,
			default: true,
			requiresReload: true
		})

		// Default the "advanced" part of the pre-roll dialog to open.
		game.settings.register(
			'foundry-ironsworn',
			'advanced-rolling-default-open',
			{
				name: 'IRONSWORN.Settings.AdvancedRollingOpen.Name',
				hint: 'IRONSWORN.Settings.AdvancedRollingOpen.Hint',
				scope: 'world',
				config: true,
				type: Boolean,
				default: false
			}
		)

		game.settings.register('foundry-ironsworn', 'character-hold', {
			name: 'IRONSWORN.Settings.CharacterHold.Name',
			hint: 'IRONSWORN.Settings.CharacterHold.Hint',
			scope: 'world',
			config: true,
			type: Boolean,
			default: false
		})

		game.settings.register('foundry-ironsworn', 'dsn-cinder-wraith', {
			name: 'IRONSWORN.Settings.RollCinderAndWraith.Name',
			hint: 'IRONSWORN.Settings.RollCinderAndWraith.Hint',
			scope: 'world',
			config: true,
			type: Boolean,
			default: false
		})

		game.settings.register('foundry-ironsworn', 'data-version', {
			scope: 'world',
			config: false,
			type: Number,
			default: 1
		})

		game.settings.register('foundry-ironsworn', 'first-run-tips-shown', {
			scope: 'world',
			config: false,
			type: Boolean,
			default: false
		})
	}

	/**
	 * Wraps {@link game.settings.get} (within the `foundry-ironsworn` scope) to ensure that Vue always gets the updated value.
	 * @param key The key of the setting within the `foundry-ironsworn` scope.
	 */
	static get<K extends string>(
		key: K
	): ClientSettings.Values[`foundry-ironsworn.${K}`] {
		return game.settings.get('foundry-ironsworn', key)
	}

	static async set<K extends string>(
		key: K,
		value: ClientSettings.Values[`foundry-ironsworn.${K}`]
	) {
		return await game.settings.set('foundry-ironsworn', key, value)
	}

	/**
	 * Update all actors of the provided types with a single data object.
	 * @param data The data to pass to each actor's `update()` method.
	 * @param actorTypes The subtypes of actor to apply the change to.
	 */
	static async updateGlobalAttribute(
		data: Record<string, unknown>,
		actorTypes: Array<IronswornActor['type']> = ['character', 'shared']
	) {
		const actorsToUpdate =
			game.actors?.contents.filter((x) => actorTypes.includes(x.type)) ?? []

		for (const actor of actorsToUpdate) {
			await actor.update({ ...data }, {
				suppressLog: true
			} as any)
		}
	}

	static get enabledRulesets(): DataswornRulesetKey[] {
		const ret: DataswornRulesetKey[] = []
		for (const ruleset of RULESETS) {
			if (IronswornSettings.get(`ruleset-${ruleset}`)) {
				ret.push(ruleset)
			}
		}
		return ret
	}

	static async enableOnlyRulesets(...enabled: DataswornRulesetKey[]) {
		for (const ruleset of RULESETS) {
			await game.settings.set(
				'foundry-ironsworn',
				`ruleset-${ruleset}`,
				enabled.includes(ruleset)
			)
		}
	}
}

Hooks.once('ready', async () => {
	await maybeMigrateToolbox()
})

async function maybeMigrateToolbox() {
	let toolboxSetting = IronswornSettings.get('toolbox')
	if (toolboxSetting === 'migrated') return

	if (toolboxSetting === 'sheet') {
		// Process this as the sheet setting
		const sheetClasses = game.settings.get('core', 'sheetClasses')
		const defaultCharacterSheet = sheetClasses.Actor?.character
		if (defaultCharacterSheet === 'ironsworn.IronswornCharacterSheetV2') {
			toolboxSetting = 'ironsworn'
		}
		toolboxSetting = 'starforged'
	}

	switch (toolboxSetting) {
		case 'ironsworn':
			await IronswornSettings.enableOnlyRulesets('classic', 'delve')
			break

		case 'starforged':
			await IronswornSettings.enableOnlyRulesets('starforged')
			break

		case 'sunderedisles':
			await IronswornSettings.enableOnlyRulesets('starforged', 'sundered_isles')
			break
	}

	// Only do this once
	await game.settings.set('foundry-ironsworn', 'toolbox', 'migrated')
}
