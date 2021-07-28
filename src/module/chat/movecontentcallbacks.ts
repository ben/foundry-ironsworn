import { IronswornActor } from '../actor/actor'
import { HIT_TYPE } from './chatrollhelpers'

type CallbackInput = {
  hitType?: HIT_TYPE
  stat?: string
  site?: IronswornActor
}

type Callback = (input: CallbackInput) => string | undefined

export const MoveContentCallbacks: { [key: string]: Callback } = {
  'Delve the Depths': ({ hitType, stat }: CallbackInput) =>
    hitType === HIT_TYPE.WEAK
      ? ` <button class="ironsworn__delvedepths__roll" data-stat="${stat}">
            Roll that table
          </button>`
      : undefined,

  'Reveal a Danger': ({ site }: CallbackInput) => `
    <button class="ironsworn__revealdanger__roll"
            data-site="${site?.id}"
    >
      Roll that table
    </button>
  `,

  Sojourn: ({ hitType }: CallbackInput) =>
    hitType === HIT_TYPE.MISS
      ? ''
      : `
        <hr>
        <p>On a hit, you and your allies may each focus on one of your chosen recover actions and roll +heart again. If you share a bond, add +1.</p>
        <p>On a <strong>strong hit</strong>, take +2 more for that action.</p>
        <p>On a <strong>weak hit</strong>, take +1 more.</p>
        <p>On a <strong>miss</strong>, it goes badly and you lose all benefits for that action.</p>
        <button class="ironsworn__sojourn__extra__roll">
          <i class="fa fa-dice-d6"></i> Roll +heart
        </button>
      `,
}
