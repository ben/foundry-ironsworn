export async function createSiMoonsChatMessage(cinder: Roll, wraith: Roll) {
	// TODO: resolve which one is higher, matches, etc.
	const params = { cinder, wraith }
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
