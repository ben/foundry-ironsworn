import { IMove } from 'dataforged'
import { get, set } from 'lodash'
import { marked } from 'marked'
import { hash } from '.'

const COMPENDIUM_KEY_MAP = {
  'Ironsworn/Moves': 'ironswornmoves',
  'Ironsworn/Oracles': 'ironswornoracles',
  'Starforged/Moves': 'starforgedmoves',
  'Starforged/Oracles': 'starforgedoracles',
  'Starforged/Encounters': 'starforgedencounters',
}
const MARKDOWN_LINK_RE = /\[(.*?)\]\((.*?)\)/g
const DESCRIPTOR_FOCUS_RE = /\[Descriptor \+ Focus\]\(.*?\)/
const ACTION_THEME_RE = /\[Action \+ Theme\]\(.*?\)/

function idIsOracleLink(dfid: string): boolean {
  return /^(Starforged|Ironsworn)\/Oracle/.test(dfid)
}

export function renderLinksInStr(text: string): string {
  // Strip "Black Medium Right-Pointing Triangle" characters
  text = text.replace('\u23f5', '')

  // Strip brackets from e.g. factions/name template
  text = text.replace(/\[(\[.*?\))\]/g, '$1')

  // Catch "Descriptor+Focus" or "Action+Theme" and replace with two links
  text = text.replace(
    DESCRIPTOR_FOCUS_RE,
    '[Descriptor](Starforged/Oracles/Core/Descriptor) + [Focus](Starforged/Oracles/Core/Focus)'
  )
  text = text.replace(
    ACTION_THEME_RE,
    '[Action](Starforged/Oracles/Core/Action) + [Theme](Starforged/Oracles/Core/Theme)'
  )

  return text.replace(MARKDOWN_LINK_RE, (match, text, url) => {
    const parts = url.split('/')
    const kind = `${parts[0]}/${parts[1]}`
    const compendiumKey = COMPENDIUM_KEY_MAP[kind]
    if (!compendiumKey) return match
    if (idIsOracleLink(url)) {
      return `<a class="entity-link oracle-category-link" data-dfid="${url}"><i class="fa fa-caret-right"></i> ${text}</a>`
    }
    return `@Compendium[foundry-ironsworn.${compendiumKey}.${hash(
      url
    )}]{${text}}`
  })
}

export function renderMarkdown(md: string, markedFn = marked.parse) {
  return markedFn(renderLinksInStr(md))
}

export function renderLinksInMove(move: IMove) {
  const textProperties = [
    'Text',
    'Trigger.Text',
    'Outcomes.Strong Hit.Text',
    'Outcomes.Strong Hit.With a Match.Text',
    'Outcomes.Weak Hit.Text',
    'Outcomes.Miss.Text',
    'Outcomes.Miss.With a Match.Text',
  ]
  for (const prop of textProperties) {
    const text = get(move, prop)
    if (!text) continue
    set(move, prop, renderLinksInStr(text))
  }
}
