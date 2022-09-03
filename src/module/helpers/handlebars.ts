import { compact, range } from 'lodash'
import { RANKS } from '../constants'
import { capitalize } from './util'
import { marked } from 'marked'
import {
  ACTION_DICE_ROLLED,
  ACTION_DIE_SIDES,
  CHALLENGE_DICE_ROLLED,
  CHALLENGE_DIE_SIDES,
  DIE_LOWEST_FACE,
  SCORE_MAX,
} from '../rolls/ironsworn-roll.js'
import {
  computeOutcomeText,
  formatRollMethod,
  formatRollPlusStat,
} from '../rolls/ironsworn-roll-message.js'
import { localeCapitalize } from '../rolls/preroll-dialog.js'

interface RollClassesOptions {
  canceled: boolean
  type: 'action' | 'challenge' | undefined
}
function classesForRoll(
  r: Roll<RollClassesOptions>,
  opts?: Partial<RollClassesOptions>
) {
  const theOpts = {
    ...{ canceled: false, type: undefined },
    ...opts,
  }
  const d = r.dice[0]
  const maxRoll = d?.faces || SCORE_MAX
  return [
    d?.constructor.name.toLowerCase(),
    d && `isiconbg-d${d.faces}-blank`,
    (d?.total || r.result) <= 1 ? 'min' : null,
    (d?.total || r.result) == maxRoll ? 'max' : null,
    theOpts.type,
    theOpts.canceled ? 'canceled' : null,
  ]
    .filter((x) => x)
    .join(' ')
}

const actionRoll = (roll) =>
  roll.terms[0].rolls.find(
    (r) => r.dice.length === 0 || r.dice[0].faces === ACTION_DIE_SIDES
  )

const challengeRolls = (roll) =>
  roll.terms[0].rolls.filter(
    (r) => r.dice.length > 0 && r.dice[0].faces === CHALLENGE_DIE_SIDES
  )

export class IronswornHandlebarsHelpers {
  static registerHelpers() {
    Handlebars.registerHelper('concat', (...args) => args.slice(0, -1).join(''))

    Handlebars.registerHelper('capitalize', localeCapitalize)
    Handlebars.registerHelper('formatRollPlusStat', formatRollPlusStat)
    Handlebars.registerHelper('formatRollMethod', formatRollMethod)
    Handlebars.registerHelper('computeOutcomeText', computeOutcomeText)
    Handlebars.registerHelper('lowercase', (str) => str.toLowerCase())

    Handlebars.registerHelper('json', function (context) {
      return JSON.stringify(context, null, 2)
    })

    Handlebars.registerHelper('join', function (context, block) {
      return context.join(block.hash.delimiter)
    })

    Handlebars.registerHelper('ifIsIronswornRoll', function (options) {
      if (
        (this.roll.dice.length === 3 &&
          this.roll.dice.filter((x) => x.faces === ACTION_DIE_SIDES).length ===
            ACTION_DICE_ROLLED &&
          this.roll.dice.filter((x) => x.faces === CHALLENGE_DIE_SIDES)
            .length === CHALLENGE_DICE_ROLLED) ||
        // TODO: extract pattern, standardize as constant
        this.roll.formula.match(/{\d+,1?d10,1?d10}/)
      ) {
        return options.fn(this)
      } else {
        return options.inverse(this)
      }
    })

    Handlebars.registerHelper('actionScoreFormula', function () {
      const r = actionRoll(this.roll)
      const terms = [...r.terms]
      const d = terms.shift()
      const classes = classesForRoll(r, {
        canceled: this.negativeMomentumCancel,
        type: 'action',
      })
      const termStrings = terms.map((t) => t.operator || t.number)
      const actionDie = d?.total ?? 0
      const totalParts = [
        this.actionCapped
          ? `<abbr title="${game.i18n.localize('IRONSWORN.CappedAt10')}">`
          : '',
        this.action.toString(),
        this.actionCapped ? '</abbr>' : '',
      ]
      return `<span class="roll ${classes}">${actionDie}</span>${termStrings.join('')} = <strong>${totalParts.join('')}</strong>`
    })

    Handlebars.registerHelper('challengeDice', function () {
      const [c1, c2] = challengeRolls(this.roll)
      const c1span = `<span class="roll ${classesForRoll(c1, {
        type: 'challenge',
      })}">${c1.total}</span>`
      const c2span = `<span class="roll ${classesForRoll(c2, {
        type: 'challenge',
      })}">${c2.total}</span>`
      return `${c1span} ${c2span}`
    })

    Handlebars.registerHelper('ironswornHitType', function () {
      const actionScore = actionRoll(this.roll).total
      const [challengeDie1, challengeDie2] = challengeRolls(this.roll).map(
        (x) => x.total
      )
      const match = challengeDie1 === challengeDie2
      if (actionScore <= Math.min(challengeDie1, challengeDie2)) {
        if (match) return game.i18n.localize('IRONSWORN.Miss_match')
        return game.i18n.localize('IRONSWORN.Miss')
      }
      if (actionScore > Math.max(challengeDie1, challengeDie2)) {
        if (match) return game.i18n.localize('IRONSWORN.Strong_hit_match')
        return game.i18n.localize('IRONSWORN.Strong_hit')
      }
      return game.i18n.localize('IRONSWORN.Weak_hit')
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

    Handlebars.registerHelper('enrichHtml', this.enrichHtml)

    Handlebars.registerHelper('enrichMarkdown', this.enrichMarkdown)

    Handlebars.registerHelper('stripTables', this.stripTables)

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
          <div class="nogrow" title="${game.i18n.localize(
            `IRONSWORN.${capitalize(testRank)}`
          )}">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              height="15"
              viewbox="0 0 17.32050807568877 20"
              class="rank-pip ${
                isFilled ? 'filled' : ''
              } clickable svg ironsworn__progress__rank"
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

  static enrichHtml(text: string) {
    const rendered = TextEditor.enrichHTML(text)
    return rendered.replace(
      /\(\(rollplus (.*?)\)\)/g,
      (_, stat) => `
        <a class="inline-roll" data-param="${stat}">
          <i class="fas fa-dice-d6"></i>
          ${formatRollPlusStat(stat)}
        </a>
      `
    )
  }

  static enrichMarkdown(md: string) {
    const html = marked.parse(md, { gfm: true })
    return IronswornHandlebarsHelpers.enrichHtml(html)
  }

  static stripTables(html: string) {
    return html.replace(/<table>[\s\S]*<\/table>/gm, '')
  }
}
