import { DieCursed } from './cursed-die'

Hooks.once('init', function () {
	CONFIG.Dice.terms['s'] = DieCursed
})

Hooks.once('diceSoNiceReady', (dice3d) => {
	dice3d.addSystem({ id: 'ironsworn', name: 'Ironsworn' }, 'preferred')
	dice3d.addDicePreset(
		{
			system: 'ironsworn',
			type: 'ds',
			labels: [
				'systems/foundry-ironsworn/assets/dice/dcursed-cursed.webp',
				'systems/foundry-ironsworn/assets/dice/dcursed-blank.webp',
				'systems/foundry-ironsworn/assets/dice/dcursed-blank.webp',
				'systems/foundry-ironsworn/assets/dice/dcursed-blank.webp',
				'systems/foundry-ironsworn/assets/dice/dcursed-blank.webp',
				'systems/foundry-ironsworn/assets/dice/dcursed-blank.webp',
				'systems/foundry-ironsworn/assets/dice/dcursed-blank.webp',
				'systems/foundry-ironsworn/assets/dice/dcursed-blank.webp',
				'systems/foundry-ironsworn/assets/dice/dcursed-blank.webp',
				'systems/foundry-ironsworn/assets/dice/dcursed-blank.webp'
			]
		},
		'd10'
	)
})

export function cinderAndWraithifyRoll(roll: Roll) {
	if (!game.settings.get('foundry-ironsworn', 'dsn-cinder-wraith')) {
		return
	}

	const challengeDice = roll.dice.filter((x) => x.faces === 10) ?? []
	if (challengeDice.length !== 2) {
		return
	}

	const cinderColor = '#e0887f'
	const wraithColor = '#6bafd7'

	const cd0options = challengeDice[0].options as any
	cd0options.appearance = {
		labelColor: (game.dice3d as any).exports?.Utils?.contrastOf(cinderColor),
		background: cinderColor,
		outline: cinderColor,
		edge: cinderColor
	}
	const cd1options = challengeDice[1].options as any
	cd1options.appearance = {
		labelColor: (game.dice3d as any).exports?.Utils?.contrastOf(wraithColor),
		background: wraithColor,
		outline: wraithColor,
		edge: wraithColor
	}
}

export function cursifyRoll(roll: Roll) {
	const die = roll.dice[0]
	const cursedColor = '#228822'
	;(die.options as any).appearance = {
		labelColor: (game.dice3d as any).exports?.Utils?.contrastOf(cursedColor),
		background: cursedColor,
		outline: cursedColor,
		edge: cursedColor
	}
}
