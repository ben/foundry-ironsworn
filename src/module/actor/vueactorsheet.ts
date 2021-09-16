import Vue from 'vue'

export class IronswornVueActorSheet extends ActorSheet {
  _vm: any | null

  /** @override */
  constructor(opts?: any, data?: any) {
    super(opts, data)
    this._vm = null
  }

  /* ------------------------------------------------------------------------ */
  /*  Vue Rendering --------------------------------------------------------- */
  /* ------------------------------------------------------------------------ */

  /** @override */
  render(force = false, options: any = {}) {
    // Grab the sheetdata for both updates and new apps.
    const sheetData = this.getData() as any
    // Exit if Vue has already rendered.
    if (this._vm) {
      const states = Application.RENDER_STATES
      if (this._state == states.RENDERING || this._state == states.RENDERED) {
        // Update the Vue app with our updated actor/item/flag data.
        if (sheetData?.data) Vue.set(this._vm.actor, 'data', sheetData.data)
        if (sheetData?.actor?.items) Vue.set(this._vm.actor, 'items', sheetData.actor.items)
        if (sheetData?.actor?.flags) Vue.set(this._vm.actor, 'flags', sheetData.actor.flags)
        this._updateEditors($(this.element))
        this.activateVueListeners($(this.element), true)
        return this
      }
      // TODO: Is destroying the app necessary?
      // else {
      //   this._vm.$destroy();
      //   this._vm = null;
      // }
    }
    // Run the normal Foundry render once.
    this._render(force, options)
      .catch((err) => {
        err.message = `An error occurred while rendering ${this.constructor.name} ${this.appId}: ${err.message}`
        console.error(err)
        this._state = Application.RENDER_STATES.ERROR
      })
      // Run Vue's render, assign it to our prop for tracking.
      .then((_rendered) => {
        // Prepare the actor data.
        const el = this.element.find('.ironsworn-vueport')
        // Render Vue and assign it to prevent later rendering.
        VuePort.render(null, el[0], { data: sheetData }).then((vm) => {
          this._vm = vm
          const html = $(this.element)
          this.activateVueListeners(html)
        })
      })
    // Update editable permission
    options.editable = options.editable ?? this.object.isOwner

    // Register the active Application with the referenced Documents
    this.object.apps[this.appId] = this
    // Return per the overridden method.
    return this
  }

  /** @override */
  async close(options = {}) {
    // TODO: Is destroying the app necessary?
    // Destroy the Vue app.
    // if (this._vm) {
    // Destroy the Vue app using its built in method.
    // this._vm.$destroy();
    // And then update our property that stores it (requires a short delay).
    // TODO: If this resolves the issue with fields getting nullified, we
    // should revisit this and implement it without the timeout.
    // setTimeout(() => {
    // this._vm = null;
    // }, 500);
    // }
    console.log('/////////////////////\r\nCLOSING SHEET\r\n/////////////////////')
    return super.close(options)
  }

  // Update initial content throughout all editors.
  _updateEditors(_html) {
    for (const [name] of Object.entries(this.editors)) {
      const data = this.object instanceof Document ? this.object.data : this.object
      const initialContent = getProperty(data, name)
      const div = $(this.element).find(`.editor-content[data-edit="${name}"]`)[0]
      const editor = this.editors && this.editors[name]
      if (editor) {
        editor.initial = initialContent
        editor.options.target = div
      }
    }
  }

  /** @override */
  activateEditor(name, options: any = {}, initialContent = '') {
    const editor = this.editors[name]
    if (!editor) throw new Error(`${name} is not a registered editor name!`)
    options = mergeObject(editor.options, options)
    options.height = options.target.offsetHeight
    // Override initial content to pull from the editor, to avoid stale data.
    initialContent = editor.initial
    TextEditor.create(options, initialContent).then((mce) => {
      editor.mce = mce
      editor.changed = false
      editor.active = true
      mce.focus()
      mce.on('change', (_ev) => (editor.changed = true))
    })
  }

  /* ------------------------------------------------------------------------ */
  /*  Event Listeners ------------------------------------------------------- */
  /* ------------------------------------------------------------------------ */

  /**
   * Activate additional listeners on the rendered Vue app.
   * @param {jQuery} html
   */
  activateVueListeners(html: JQuery, repeat = false) {
    if (!this.options.editable) {
      html.find('input,select,textarea').attr('disabled', 'true')
      return
    }

    // Place one-time executions after this line.
    if (repeat) return

    html.find('.editor-content[data-edit]').each((_i, div) => this._activateEditor(div))

    // Input listeners.
    const inputs = '.section input[type="text"], .section input[type="number"]'
    html.on('focus', inputs, (event) => this._onFocus(event))
  }

  _onFocus(event) {
    const target = event.currentTarget
    setTimeout(function () {
      if (target == document.activeElement) {
        $(target).trigger('select')
      }
    }, 100)
  }
}
