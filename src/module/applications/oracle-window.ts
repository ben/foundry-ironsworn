import { VueAppMixin } from '../vue/vueapp'
import OracleWindowComponent from '../vue/oracle-window.vue'

export class OracleWindow extends VueAppMixin(Application) {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: game.i18n.localize('IRONSWORN.ROLLTABLES.TypeOracle'),
			id: 'oracles',
			resizable: true,
			width: 350,
			height: 400,
			rootComponent: OracleWindowComponent
		}) as any
	}
}
