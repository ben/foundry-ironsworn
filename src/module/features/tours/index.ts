import { IronswornSettings } from '../../helpers/settings'
import { WelcomeTour } from './welcome'

export async function registerTours() {
  // Register our tours
  game.tours.register('foundry-ironsworn', 'welcome', new WelcomeTour())

  ui.chat?.element?.on('click', '#ironsworn-tour', (el) => {
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
    content: `
      <h3>Welcome to Ironsworn!</h3>
      <p>If this is your first time using the system, click this to for an interactive tour:</p>
      <button id="ironsworn-tour">
        <i class="fas fa-person-hiking"></i>
        Launch Tour
      </button>
    `,
  })

  game.settings.set('foundry-ironsworn', 'first-run-tips-shown', true)
}
