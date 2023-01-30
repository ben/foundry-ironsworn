import { IronswornSettings } from '../../helpers/settings'
import { WelcomeTour } from './welcome'

export async function registerTours() {
  // Register our tours
  game.tours.register('foundry-ironsworn', 'welcome', new WelcomeTour())

  // Maybe post a message linking to the first one
  if (IronswornSettings.get('first-run-tips-shown')) return
  console.log('Posting first-start messages...')

  const gms = ChatMessage.getWhisperRecipients('GM')

  // game.settings.set('foundry-ironsworn', 'first-run-tips-shown', true)
}
