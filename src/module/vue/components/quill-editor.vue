<template>
  <div
    style="border: 1px solid black"
    :class="cssClasses"
    @dragenter="dragHandler($event, true)"
    @dragover="dragHandler($event, true)"
    @dragleave="dragHandler($event, false)"
    @dragend="dragHandler($event, false)"
    @drop="dropHandler"
  >
    <VueEditor
      ref="quilleditor"
      :placeholder="placeholder"
      :editorOptions="options"
      v-bind:value="value"
      @input="$emit('input', $event)"
      class="flexcol"
      style="height: 100%; width: 100%"
    />
  </div>
</template>

<style lang="less">
.ql-container {
  font-family: var(--font-primary) !important;
}
.ql-editor {
  width: 100%;
}
.ql-tooltip {
  z-index: 100;
}
.ql-toolbar {
  flex-grow: 0;
}
.ql-container {
  display: flex;
  flex-grow: 1;
}
</style>

<script>
import { VueEditor, Quill } from 'vue2-editor'
import Delta from 'quill-delta'

// TODO: move this to its own file
const Inline = Quill.import('blots/inline')
class FoundryLink extends Inline {
  static create(value) {
    console.log(value)
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
    node.classList = 'entity-link content-link'
    node.dataset.type = value.type
    node.dataset.entity = value.type
    if (value.pack) node.dataset.pack = value.pack
    node.innerHTML = `
      <i class="${CONFIG[value.type].sidebarIcon}"></i> ${document.name}
    `
    console.log(node)
    return node
  }

  static formats(domNode) {
    console.log(domNode)
    return domNode.getAttribute('class').match(/(entity|content)-link/)
  }

  format(name, value) {
    console.log({ name, value })
    if (name !== this.statics.blotName || !value) {
      super.format(name, value)
    } else {
      this.domNode.setAttribute('href', this.constructor.sanitize(value))
    }
  }
}
FoundryLink.blotName = 'foundrylink'
FoundryLink.tagName = 'a'
console.log(Inline)

Quill.register('formats/foundrylink', FoundryLink)

export default {
  components: { VueEditor },

  props: {
    placeholder: String,
    value: String,

    theme: {
      type: String,
      default: 'snow',
    },

    toolbarOptions: {
      type: Array,
      default: [
        [{ header: [false, 1, 2, 3, 4] }, 'bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
    },
  },

  data() {
    return {
      cssClasses: {
        'drag-highlight': false,
      },
      options: {
        theme: this.theme,
        modules: {
          // foundrylink: true,
          toolbar: {
            container: this.toolbarOptions,
            handlers: {
              image() {
                const quill = this.quill
                new FilePicker({
                  type: 'image',
                  callback(path) {
                    const range = quill.getSelection(true)
                    const delta = new Delta()
                      .retain(range.index)
                      .delete(range.length)
                      .insert({ image: path })
                    quill.updateContents(delta, 'user')
                  },
                }).render(true)
              },
            },
          },
        },
      },
    }
  },

  methods: {
    dragHandler(ev, highlight) {
      this.cssClasses['drag-highlight'] = highlight
      return false
    },

    async dropHandler(ev) {
      this.cssClasses['drag-highlight'] = false

      const data = TextEditor.getDragEventData(ev)
      const link = await TextEditor.getContentLink(data)
      console.log('Drop!', data, link)

      const quill = this.$refs.quilleditor.quill
      const range = quill.getSelection(true)
      const delta = new Delta()
        .retain(range.index)
        .delete(range.length)
        .insert({ foundrylink: data })
      await quill.updateContents(delta, 'user')

      ev.preventDefault()
      return false
    },
  },
}
</script>
