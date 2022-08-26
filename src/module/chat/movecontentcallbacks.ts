import { IronswornActor } from '../actor/actor'
import { RollOutcome } from '../rolls/ironsworn-roll'

type CallbackInput = {
  hitType?: RollOutcome
  stat?: string
  site?: IronswornActor
}

type Callback = (input: CallbackInput) => string | undefined

export const MoveContentCallbacks: { [key: string]: Callback } = {
  'Delve the Depths': ({ hitType, stat }: CallbackInput) =>
    hitType === RollOutcome.Weak_hit
      ? ` <button class="ironsworn__delvedepths__roll" data-stat="${stat}">
            <i class="fa fa-dice-d6"></i> ${game.i18n.localize(
              'IRONSWORN.Roll'
            )}
          </button>`
      : undefined,

  'Reveal a Danger': ({ site }: CallbackInput) => `
    <button class="ironsworn__revealdanger__roll" data-site="${site?.id}">
      <i class="fa fa-dice-d6"></i> ${game.i18n.localize('IRONSWORN.Roll')}
    </button>
  `,

  Sojourn: ({ hitType }: CallbackInput) =>
    hitType === RollOutcome.Miss
      ? undefined
      : `
        <hr>
        <p>${game.i18n.localize(
          'IRONSWORN.MoveContents.Sojourn.extradescription'
        )}</p>
        <button class="ironsworn__sojourn__extra__roll">
          <i class="fa fa-dice-d6"></i> ${game.i18n.localize('IRONSWORN.Roll')}
        </button>
      `,

  'Pay the Price': () =>
    `<button class="ironsworn__paytheprice__roll">
      <i class="fa fa-dice-d6"></i> ${game.i18n.localize('IRONSWORN.Roll')}
    </button>`,
}
