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
  CONFIG.Dice.template = 'systems/foundry-ironsworn/templates/dice/roll.html'
  // CONFIG.Dice.tooltip = 'systems/foundry-ironsworn/templates/dice/tooltip.html'

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

  game.ironswornMoveRoll = async function (
    bonusExpr = '0',
    values = {},
    title
  ) {
    const r = new Roll(`{d6+${bonusExpr}, d10,d10}`, values).roll()
    if (true) {
      r.toMessage({ flavor: title })
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

Handlebars.registerHelper('join', function (a, joiner) {
  return a.join(joiner)
})

Handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context, null, 2)
})

Handlebars.registerHelper('ifIsIronswornRoll', function (options) {
  if (!!this.formula.match(/^{d6.*d10,d10}$/)) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
})

function classesForRoll (r) {
  const d = r.dice[0]
  const minRoll = Math.min(...d.sides)
  const maxRoll = Math.max(...d.sides)
  return [
    d.constructor.name.toLowerCase(),
    'd' + d.faces,
    d.total === minRoll ? 'min' : null,
    d.total === maxRoll ? 'max' : null
  ]
    .filter(x => x)
    .join(' ')
}

Handlebars.registerHelper('actionDieFormula', function () {
  const r = this.roll.parts[0].rolls[0]
  const parts = [...r.parts]
  const d = parts.shift()
  const classes = classesForRoll(r)

  return `<span class="roll ${classes}">${d.total}</span>${parts.join('')}`
})

Handlebars.registerHelper('challengeDice', function () {
  const c1 = this.roll.parts[0].rolls[1]
  const c2 = this.roll.parts[0].rolls[2]
  const c1span = `<span class="roll ${classesForRoll(c1)}">${c1.total}</span>`
  const c2span = `<span class="roll ${classesForRoll(c2)}">${c2.total}</span>`
  return `${c1span} / ${c2span}`
})

Handlebars.registerHelper('ironswornHitType', function () {
  const actionTotal = this.roll.parts[0].rolls[0].total
  const challenge1 = this.roll.parts[0].rolls[1].total
  const challenge2 = this.roll.parts[0].rolls[2].total
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
