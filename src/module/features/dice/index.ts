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
