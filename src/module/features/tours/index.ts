import { IronswornSettings } from '../../helpers/settings'
import { WelcomeTour } from './welcome_tour'

export async function registerTours() {
  // Register our tours
  game.tours.register('foundry-ironsworn', 'welcome', new WelcomeTour())

  // Add listener for the chat-message button
  $(document).on('click', '#chat-log #ironsworn-tour-chat-button', (el) => {
    const tour = game.tours.get('foundry-ironsworn.welcome')
    tour?.start()
  })

  // Maybe post a message linking to the first one
  if (IronswornSettings.get('first-run-tips-shown')) return
  console.log('Posting first-start messages...')

  const gms = ChatMessage.getWhisperRecipients('GM')
  const cm = ChatMessage.implementation as typeof ChatMessage
  ChatMessage.create({
    whisper: gms,
    speaker: { alias: game.i18n.localize('IRONSWORN.Ironsworn') },
    content: game.i18n.localize('IRONSWORN.Tours.ChatMessage'),
  })

  game.settings.set('foundry-ironsworn', 'first-run-tips-shown', true)
}
