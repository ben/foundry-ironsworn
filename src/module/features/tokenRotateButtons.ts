// https://github.com/zeel01/TokenHUDArtButton/blob/master/artbutton.js#L281

function rotateTokenBy(ev: JQuery.ClickEvent, tokenData: any, angle: number) {
	ev.preventDefault()
	const token = canvas?.scene?.tokens.get(tokenData._id)
	if (token == null) return
	// @ts-expect-error
	const rotation = token.rotation + angle
	void canvas?.scene?.updateEmbeddedDocuments('Token', [
		{ _id: token.id, rotation }
	])
}

function HUDCallback(_hud, html, token) {
	const leftButton = document.createElement('div')
	leftButton.classList.add('control-icon')
	leftButton.innerHTML = '<i class="fas fa-undo" />'
	leftButton.dataset.tooltip = game.i18n.localize('IRONSWORN.RotateCCW')
	$(leftButton).on('click', (ev) => {
		rotateTokenBy(ev, token, -60)
	})

	const rightButton = document.createElement('div')
	rightButton.classList.add('control-icon')
	rightButton.innerHTML = '<i class="fas fa-redo" />'
	rightButton.dataset.tooltip = game.i18n.localize('IRONSWORN.RotateCW')
	$(rightButton).on('click', (ev) => {
		rotateTokenBy(ev, token, 60)
	})

	html.find('div.left').prepend(leftButton)
	html.find('div.right').prepend(rightButton)
}

export async function registerTokenHUDButtons() {
	Hooks.on('renderTokenHUD', HUDCallback)
}
