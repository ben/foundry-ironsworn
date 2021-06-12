import { capitalize } from './util'

function classesForRoll(r) {
  const d = r.dice[0]
  const maxRoll = d?.faces || 10
  return [d?.constructor.name.toLowerCase(), d && 'd' + d.faces, (d?.total || r.result) <= 1 ? 'min' : null, (d?.total || r.result) == maxRoll ? 'max' : null].filter((x) => x).join(' ')
}

const actionRoll = (roll) => roll.terms[0].rolls.find((r) => r.dice.length === 0 || r.dice[0].faces === 6)

const challengeRolls = (roll) => roll.terms[0].rolls.filter((r) => r.dice.length > 0 && r.dice[0].faces === 10)

export class IronswornHandlebarsHelpers {
  static registerHelpers() {
    Handlebars.registerHelper('concat', (...args) => args.slice(0, -1).join(''))

    Handlebars.registerHelper('capitalize', capitalize)

    Handlebars.registerHelper('join', function (a, joiner) {
      return a.join(joiner)
    })

    Handlebars.registerHelper('json', function (context) {
      return JSON.stringify(context, null, 2)
    })

    Handlebars.registerHelper('ifIsIronswornRoll', function (options) {
      if ((this.roll.dice.length === 3 && this.roll.dice.filter((x) => x.faces === 6).length === 1 && this.roll.dice.filter((x) => x.faces === 10).length === 2) || this.roll.formula.match(/{\d+,1?d10,1?d10}/)) {
        return options.fn(this)
      } else {
        return options.inverse(this)
      }
    })

    Handlebars.registerHelper('actionDieFormula', function () {
      const r = actionRoll(this.roll)
      const terms = [...r.terms]
      const d = terms.shift()
      const classes = classesForRoll(r)
      const termStrings = terms.map((t) => t.operator || t.number)
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
      const [challenge1, challenge2] = challengeRolls(this.roll).map((x) => x.total)
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

    Handlebars.registerHelper('progressCharacters', (current) => {
      const tickChar = [' ', '-', '+', '*'][current % 4]
      const characters = [] as string[]
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

    Handlebars.registerHelper('enrichHtml', (text) => {
      const rendered = TextEditor.enrichHTML(text)
      return rendered.replace(/\(\(rollplus (.*?)\)\)/g, `<a class='inline-roll' data-param='$1'><i class='fas fa-dice-d6'></i>${game.i18n.localize('IRONSWORN.Roll')} +$1</a>`)
    })

    Handlebars.registerHelper('rangeEach', function (context, _options) {
      const results = [] as string[]
      const { from, to, current, min, max } = context.hash

      // Enable both directions of iteration
      const increment = from > to ? -1 : 1
      const shouldContinue = from > to ? (x, y) => x >= y : (x, y) => x <= y

      for (let value = from; shouldContinue(value, to); value += increment) {
        const valueStr = value > 0 ? `+${value}` : value.toString()
        const isCurrent = value === current
        const lteCurrent = value <= current
        const isAboveMax = max === undefined ? false : value > max
        const isBelowMin = min === undefined ? false : value < min

        results.push(
          context.fn({
            ...this,
            valueStr,
            value,
            isCurrent,
            lteCurrent,
            isAboveMax,
            isBelowMin,
            isOutOfBounds: isAboveMax || isBelowMin,
          })
        )
      }
      return results.join('\n')
    })
  }
}
