/* globals game CONFIG */
import { Quill } from 'vue2-editor'

const Inline = Quill.import('blots/inline')
const Embed = Quill.import('blots/embed')

export default class FoundryLink extends Embed {
  static create(value) {
    return FoundryLink.render(value)
  }

  static value(domNode) {
    const { type, pack, id } = domNode.dataset
    return { type, pack, id }
  }

  html() {
    return FoundryLink.render(this.value())
  }

  static render(value) {
    // {type: 'JournalEntry', id: 'SGjaokGHk4vmTWpt'}
    // {type: 'Actor', pack: 'foundry-ironsworn.foeactorsis', id: 'VcHQfffDX9tNZTJw'}

    // Fetch the document
    let document
    if (value.pack) {
      const pack = game.packs.get(value.pack)
      document = pack.get(value.id)
    } else {
      const collection = game.collections.get(value.type)
      document = collection.get(value.id)
    }

    // Construct the node
    // <a class="entity-link content-link" draggable="true" data-type="Item" data-entity="Item" data-id="Qis1cOG7uJqudomf"><i class="fas fa-suitcase"></i> hey</a>
    // <a class="entity-link content-link" draggable="true" data-pack="foundry-ironsworn.foeactorsis" data-id="A4nXqwLbSNh7xQy4"><i class="fas fa-user"></i> Basilisk</a>
    const node = super.create(value)
    node.classList.add('entity-link')
    node.classList.add('content-link')
    node.draggable = 'true'
    node.dataset.type = value.type
    node.dataset.entity = value.type
    node.dataset.id = value.id
    if (value.pack) node.dataset.pack = value.pack
    node.innerHTML = `
      <i class="${CONFIG[value.type].sidebarIcon}"></i> ${document.name}
    `
    console.log(node)
    return node
  }
}
FoundryLink.blotName = 'foundrylink'
FoundryLink.className = 'foundrylink'
FoundryLink.tagName = 'a'

Quill.register('formats/foundrylink', FoundryLink)
