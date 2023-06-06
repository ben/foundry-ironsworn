import type { IronswornActor } from '../actor/actor'
import { IronswornPrerollDialog } from '../rolls'

interface InlineRollListenerOptions {
	actor?: IronswornActor<'character'>
	name?: string
}

export function attachInlineRollListeners(
	html: JQuery,
	opts?: InlineRollListenerOptions
) {
	const realOpts = { ...opts }
	html.find('a.inline-roll').on('click', (ev) => {
		if (realOpts.actor == null) return

		const el = ev.currentTarget
		const stat = el.dataset.param
		const statValue = realOpts.actor.system[stat ?? '']
		if (!stat || !statValue) return
		ev.preventDefault()

		IronswornPrerollDialog.showForStat(stat, statValue, realOpts.actor)
	})
}
