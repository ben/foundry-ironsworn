export async function ironswornMoveRoll (bonusExpr = '0', values = {}, title: string) {
  const r = new Roll(`{d6+${bonusExpr}, d10,d10}`, values).roll()
  r.toMessage({ flavor: `<div class="move-title">${title}</div>` })
}

export class IronswornRollDialog extends Dialog {
  static async showDialog(data: any, stat: string, title: string) {
    const template = 'systems/foundry-ironsworn/templates/roll-dialog.hbs'
    const templateData = { data, stat }
    const html = await renderTemplate(template, templateData)
    const d = new IronswornRollDialog({
      title: title || `Roll +${stat}`,
      content: html,
      buttons: {
        roll: {
          icon: '<i class="fas fa-dice-d10"></i>',
          label: game.i18n.localize('IRONSWORN.Roll'),
          callback: x => {
            const form = x[0].querySelector('form')
            const bonus = parseInt(form[0].value, 10)
            ironswornMoveRoll(`@${stat}+${bonus || 0}`, data, title)
          }
        }
      },
      default: 'roll'
    })
    d.render(true)
  }
}

// Autofucus on input box when rolling
Hooks.on('renderIronswornRollDialog', async (_dialog, html, _data) => {
  html.find('input').focus()
})
