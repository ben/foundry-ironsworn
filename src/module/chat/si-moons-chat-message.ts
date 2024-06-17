const MOON_EMOJI = [
	'',
	'🌑',
	'🌒',
	'🌒',
	'🌒',
	'🌓',
	'🌓',
	'🌔',
	'🌔',
	'🌔',
	'🌕'
]

export async function createSiMoonsChatMessage(cinder: Roll, wraith: Roll) {
	// TODO: resolve which one is higher, matches, etc.
	const params = {
		cinder,
		cinderEmoji: MOON_EMOJI[cinder.total ?? 1],
		wraith,
		wraithEmoji: MOON_EMOJI[wraith.total ?? 1]
	}
	const content = await renderTemplate(
		'systems/foundry-ironsworn/templates/rolls/si-moons-roll-message.hbs',
		params
	)
	await ChatMessage.create({
		speaker: ChatMessage.getSpeaker(),
		content,
		rolls: [cinder, wraith]
	})
}
