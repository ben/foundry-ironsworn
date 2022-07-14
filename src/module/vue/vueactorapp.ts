import { IronswornActor } from '../actor/actor'
import { VueApplication } from './vueapp'

export abstract class VueActorApp extends VueApplication {
  constructor(
    protected actor: IronswornActor,
    options?: Partial<ApplicationOptions>
  ) {
    super(options)
  }

  setupApp(data) {
    super.setupApp(data)
    this.vueApp?.provide('$actor', this.actor)
    this.vueApp?.provide('actor', this.actor.toObject(true))
  }
}
