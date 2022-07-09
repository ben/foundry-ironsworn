import { Plugin } from 'vue'

const plugin: Plugin = {
  install(app, ..._options) {
    app.config.globalProperties.$t = (k) => game.i18n.localize(k)
  },
}

export default plugin
