/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 * Software License: GNU GPLv3
 */

// Import Modules
import { IronswornActor } from './actor.js'
import { IronswornItemSheet } from './item-sheet.js'
import { IronswornActorSheet } from './actor-sheet.js'

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once('init', async function () {
  console.log(`Initializing Ironsworn System`)

  // Define custom Entity classes
  CONFIG.Actor.entityClass = IronswornActor
  CONFIG.Dice.template = 'systems/foundry-ironsworn/templates/chat/roll.hbs'
  // CONFIG.RollTable.resultTemplate =
  //   'systems/foundry-ironsworn/templates/chat/table-draw.hbs'

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet)
  Actors.registerSheet('ironsworn', IronswornActorSheet, { makeDefault: true })
  Items.unregisterSheet('core', ItemSheet)
  Items.registerSheet('ironsworn', IronswornItemSheet, { makeDefault: true })

  // Register system settings
  game.settings.register('ironsworn', 'macroShorthand', {
    name: 'SETTINGS.SimpleMacroShorthandN',
    hint: 'SETTINGS.SimpleMacroShorthandL',
    scope: 'world',
    type: Boolean,
    default: true,
    config: true
  })
})

Hooks.once('setup', () => {
  Roll.prototype.render = async function (chatOptions = {}) {
    chatOptions = mergeObject(
      {
        user: game.user._id,
        flavor: null,
        template: CONFIG.Dice.template,
        blind: false
      },
      chatOptions
    )
    const isPrivate = chatOptions.isPrivate
    // Execute the roll, if needed
    if (!this._rolled) this.roll()
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

Hooks.on('createActor', async actor => {
  if (actor.data.type !== 'character') return
  if (actor.items.size !== 0) return
  const pack = game.packs.get('foundry-ironsworn.ironswornitems')
  for (const indexEntry of await pack.getIndex()) {
    console.log(indexEntry)
    if (indexEntry.name.match(/^Move:/)) {
      const item = await pack.getEntity(indexEntry._id)
      console.log(await actor.createOwnedItem(item))
    }
  }
})

// Autofucus on input box when rolling
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
    this.roll.dice.length === 3 &&
    this.roll.dice.filter(x => x.faces === 6).length === 1 &&
    this.roll.dice.filter(x => x.faces === 10).length === 2
  ) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
})

function classesForRoll (r) {
  const d = r.dice[0]
  const maxRoll = d.faces
  return [
    d.constructor.name.toLowerCase(),
    'd' + d.faces,
    d.total === 1 ? 'min' : null,
    d.total === maxRoll ? 'max' : null
  ]
    .filter(x => x)
    .join(' ')
}

const actionRoll = roll => roll.parts[0].rolls.find(r => r.dice[0].faces === 6)

const challengeRolls = roll =>
  roll.parts[0].rolls.filter(r => r.dice[0].faces === 10)

Handlebars.registerHelper('actionDieFormula', function () {
  const r = actionRoll(this.roll)
  const parts = [...r.parts]
  const d = parts.shift()
  const classes = classesForRoll(r)

  return `<strong><span class="roll ${classes}">${d.total}</span>${parts.join('')}</strong>`
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
    if (match) return 'Complication!'
    return 'Miss'
  }
  if (actionTotal > Math.max(challenge1, challenge2)) {
    if (match) return 'Opportunity!'
    return 'Strong Hit'
  }
  return 'Weak Hit'
})

export async function ironswornMoveRoll (bonusExpr = '0', values = {}, title) {
  const r = new Roll(`{d6+${bonusExpr}, d10,d10}`, values).roll()
  if (true) {
    r.toMessage({ flavor: `<div class="move-title">${title}</div>` })
    return
  }

  const template = 'systems/foundry-ironsworn/templates/dice/roll.html'
  const templateData = {
    roll: r,
    user: game.user._id
  }
  const content = await renderTemplate(template, templateData)

  const rollChatData = {
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    roll: r,
    content
  }
  ChatMessage.create(rollChatData)
}

class IronswornRollDialog extends Dialog {}

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
        label: 'Roll',
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
