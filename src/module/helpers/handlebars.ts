import { range } from 'lodash'
import { RANKS } from '../constants'
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
    Handlebars.registerHelper('lowercase', (str) => str.toLowerCase())

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
      return `<strong><span class="roll ${classes}">${d?.total || 0}</span>${termStrings.join('')}</strong>`
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

    function tickMarkSvg(ticks: number): string {
      let ret = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
      if (ticks > 0) ret += '<line x1="15" y1="15" x2="85" y2="85" />'
      if (ticks > 1) ret += '<line x1="85" y1="15" x2="15" y2="85" />'
      if (ticks > 2) ret += '<line x1="15" y1="50" x2="85" y2="50" />'
      if (ticks > 3) ret += '<line x1="50" y1="15" x2="50" y2="85" />'
      return ret + '</svg>'
    }

    Handlebars.registerHelper('progressCharacters', (current) => {
      const ret: string[] = []
      range(10).forEach(() => {
        ret.push(tickMarkSvg(current))
        current -= 4
      })
      return ret
    })

    Handlebars.registerHelper('enrichHtml', (text) => {
      const rendered = TextEditor.enrichHTML(text)
      const rollText = game.i18n.localize('IRONSWORN.Roll')
      return rendered.replace(
        /\(\(rollplus (.*?)\)\)/g,
        (_, stat) => `
          <a class="inline-roll" data-param="${stat}">
            <i class="fas fa-dice-d6"></i>
            ${rollText} +${game.i18n.localize(`IRONSWORN.${capitalize(stat)}`).toLowerCase()}
          </a>
        `
      )
    })

    Handlebars.registerHelper('rangeEach', function (context, _options) {
      const results: string[] = []
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

    Handlebars.registerHelper('rankIsAtLeast', function (_context, _options) {
      // const {rank, self} = context.hash
      return true
    })

    Handlebars.registerPartial('rankHexes', (ctx, _opts) => {
      const { rank, id } = ctx
      const position = Object.keys(RANKS).indexOf(rank)
      const hexes: string[] = []
      for (const testRank in RANKS) {
        const isFilled = position >= Object.keys(RANKS).indexOf(testRank)
        hexes.push(`
          <div class="nogrow" title="${game.i18n.localize(`IRONSWORN.${capitalize(testRank)}`)}">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              height="15"
              viewbox="0 0 17.32050807568877 20"
              class="rank-pip ${isFilled ? 'filled' : ''} clickable svg ironsworn__progress__rank"
              data-rank="${testRank}"
              data-item="${id}"
            >
              <path
                stroke-width="1"
                d="M8.660254037844386 0L17.32050807568877 5L17.32050807568877 15L8.660254037844386 20L0 15L0 5Z">
              </path>
            </svg>
          </div>
        `)
      }
      return hexes.join('')
    })
  }
}
