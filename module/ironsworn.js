/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 * Software License: GNU GPLv3
 */

// Import Modules
import { IronswornActor } from './actor.js'
import { IronswornItem } from './item.js'
import { IronswornItemSheet } from './item-sheet.js'
import { IronswornActorSheet } from './actor-sheet.js'
import { importFromDatasworn } from './datasworn.js'

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once('init', async function () {
  console.log(`Initializing Ironsworn System`)

  // Define custom Entity classes
  CONFIG.Actor.documentClass = IronswornActor
  CONFIG.Item.documentClass = IronswornItem
  CONFIG.Dice.template = 'systems/foundry-ironsworn/templates/chat/roll.hbs'
  // CONFIG.RollTable.resultTemplate =
  //   'systems/foundry-ironsworn/templates/chat/table-draw.hbs'

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet)
  Actors.registerSheet('ironsworn', IronswornActorSheet, { makeDefault: true })
  Items.unregisterSheet('core', ItemSheet)
  Items.registerSheet('ironsworn', IronswornItemSheet, { makeDefault: true })

  game.Ironsworn = {
    importFromDatasworn
  }
})

Hooks.once('setup', () => {
  Roll.prototype.render = async function (chatOptions = {}) {
    chatOptions = mergeObject(
      {
        user: game.user.id,
        flavor: null,
        template: CONFIG.Dice.template,
        blind: false
      },
      chatOptions
    )
    const isPrivate = chatOptions.isPrivate
    // Execute the roll, if needed
    if (!this._evaluated) await this.evaluate()
    // Define chat data
    const chatData = {
      formula: isPrivate ? '???' : this.formula,
      roll: this, // this is new
      flavor: isPrivate ? null : chatOptions.flavor,
      user: chatOptions.user,
      tooltip: isPrivate ? '' : await this.getTooltip(),
      total: isPrivate ? '?' : Math.round(this.total * 100) / 100
    }
    // Render the roll display template
    return renderTemplate(chatOptions.template, chatData)
  }
})

// Autofucus on input box when rolling
class IronswornRollDialog extends Dialog {}
Hooks.on('renderIronswornRollDialog', async (dialog, html, data) => {
  html.find('input').focus()
})

Handlebars.registerHelper('join', function (a, joiner) {
  return a.join(joiner)
})

Handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context, null, 2)
})

Handlebars.registerHelper('ifIsIronswornRoll', function (options) {
  if (
    (this.roll.dice.length === 3 &&
      this.roll.dice.filter(x => x.faces === 6).length === 1 &&
      this.roll.dice.filter(x => x.faces === 10).length === 2) ||
    this.roll.formula.match(/{\d+,1?d10,1?d10}/)
  ) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
})

function classesForRoll (r) {
  const d = r.dice[0]
  const maxRoll = d?.faces || 10
  return [
    d?.constructor.name.toLowerCase(),
    d && 'd' + d.faces,
    (d?.total || r.result) <= 1 ? 'min' : null,
    (d?.total || r.result) == maxRoll ? 'max' : null
  ]
    .filter(x => x)
    .join(' ')
}

const actionRoll = roll =>
  roll.terms[0].rolls.find(r => r.dice.length === 0 || r.dice[0].faces === 6)

const challengeRolls = roll =>
  roll.terms[0].rolls.filter(r => r.dice.length > 0 && r.dice[0].faces === 10)

Handlebars.registerHelper('actionDieFormula', function () {
  const r = actionRoll(this.roll)
  const terms = [...r.terms]
  const d = terms.shift()
  const classes = classesForRoll(r)
  const termStrings = terms.map(t => t.operator || t.number)
  return `<strong><span class="roll ${classes}">${d?.total || d}</span>${termStrings.join('')}</strong>`
})

Handlebars.registerHelper('challengeDice', function () {
  const [c1, c2] = challengeRolls(this.roll)
  const c1span = `<span class="roll ${classesForRoll(c1)}">${c1.total}</span>`
  const c2span = `<span class="roll ${classesForRoll(c2)}">${c2.total}</span>`
  return `${c1span} ${c2span}`
})

Handlebars.registerHelper('ironswornHitType', function () {
  const actionTotal = actionRoll(this.roll).total
  const [challenge1, challenge2] = challengeRolls(this.roll).map(x => x.total)
  const match = challenge1 === challenge2
  if (actionTotal <= Math.min(challenge1, challenge2)) {
    if (match) return game.i18n.localize('IRONSWORN.Complication')
    return game.i18n.localize('IRONSWORN.Miss')
  }
  if (actionTotal > Math.max(challenge1, challenge2)) {
    if (match) return game.i18n.localize('IRONSWORN.Opportunity')
    return game.i18n.localize('IRONSWORN.StrongHit')
  }
  return game.i18n.localize('IRONSWORN.WeakHit')
})

export async function ironswornMoveRoll (bonusExpr = '0', values = {}, title) {
  const r = new Roll(`{d6+${bonusExpr}, d10,d10}`, values).roll()
  r.toMessage({ flavor: `<div class="move-title">${title}</div>` })
}

export async function ironswornRollDialog (data, stat, title) {
  const template = 'systems/foundry-ironsworn/templates/roll-dialog.hbs'
  const templateData = { data, stat }
  const html = await renderTemplate(template, templateData)
  let d = new IronswornRollDialog({
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

Handlebars.registerHelper('rangeEach', function (context, options) {
  const results = []
  const { from, to, current } = context.hash

  // Enable both directions of iteration
  const increment = from > to ? -1 : 1
  const shouldContinue = from > to ? (x, y) => x >= y : (x, y) => x <= y

  for (let value = from; shouldContinue(value, to); value += increment) {
    const valueStr = value > 0 ? `+${value}` : value.toString()
    const isCurrent = value === current
    const lteCurrent = value <= current
    results.push(
      context.fn({
        ...this,
        valueStr,
        value,
        isCurrent,
        lteCurrent
      })
    )
  }
  return results.join('\n')
})

Handlebars.registerHelper('concat', (...args) => args.slice(0, -1).join(''))

Handlebars.registerHelper('capitalize', txt => {
  const [first, ...rest] = txt
  return `${first.toUpperCase()}${rest.join('')}`
})

Handlebars.registerHelper('progressCharacters', current => {
  const tickChar = [' ', '-', '+', '*'][current % 4]
  let characters = []
  for (let i = 0; i < Math.floor(current / 4); i++) {
    characters.push('#')
  }
  if (characters.length < 10) {
    characters.push(tickChar)
  }
  while (characters.length < 10) {
    characters.push('&nbsp;')
  }
  return characters
})

Handlebars.registerHelper('enrichHtml', text => {
  const rendered = TextEditor.enrichHTML(text)
  return rendered.replace(
    /\(\(rollplus (.*?)\)\)/g,
    `<a class='inline-roll' data-param='$1'><i class='fas fa-dice-d6'></i>${game.i18n.localize('IRONSWORN.Roll')} +$1</a>`
  )
})

export const RANKS = {
  troublesome: 'IRONSWORN.Troublesome',
  dangerous: 'IRONSWORN.Dangerous',
  formidible: 'IRONSWORN.Formidible',
  extreme: 'IRONSWORN.Extreme',
  epic: 'IRONSWORN.Epic'
}

export const RANK_INCREMENTS = {
  troublesome: 12,
  dangerous: 8,
  formidible: 4,
  extreme: 2,
  epic: 1
}
