import { IronswornActor } from '../actor/actor'
import { HIT_TYPE } from './chatrollhelpers'

type CallbackInput = {
  hitType?: HIT_TYPE
  stat?: string
  site?: IronswornActor
}

type Callback = (input?: CallbackInput) => string | undefined

export const MoveContentCallbacks: { [key: string]: Callback } = {
  'Delve the Depths': ({hitType, stat} = {}) =>
    hitType === HIT_TYPE.WEAK
      ? ` <button class="ironsworn__delvedepths__roll" data-stat="${stat}">
            Roll that table
          </button>`
      : undefined,

  'Reveal a Danger': () => '<button class="ironsworn__revealdanger__roll">Roll that table</button>',
}
