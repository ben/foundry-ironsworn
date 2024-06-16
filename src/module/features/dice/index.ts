import { DieCursed } from './cursed-die'

Hooks.once('init', function () {
	CONFIG.Dice.terms['s'] = DieCursed
})
