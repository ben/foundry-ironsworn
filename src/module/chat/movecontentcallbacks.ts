import { HIT_TYPE } from './chatrollhelpers'

type Callback = (hitType: HIT_TYPE, stat?: string) => string | undefined

export const MoveContentCallbacks: { [key: string]: Callback } = {
  'Delve the Depths': (hitType, stat) =>
    hitType === HIT_TYPE.WEAK
      ? ` <button class="ironsworn__delvedepths__roll" data-stat="${stat}">
            Roll that table
          </button>`
      : undefined,

  'Reveal a Danger': () => '<button class="ironsworn__revealdanger__roll">Roll that table</button>',
}
