import { VueApplication } from './vueapp'
import { starforged } from 'dataforged'
import sfTruthsVue from '../vue/sf-truths.vue'
import { Component } from 'vue'

export class SFSettingTruthsDialogVue extends VueApplication {
  static get defaultOptions(): ApplicationOptions {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.SFSettingTruthsTitle'),
      template: 'systems/foundry-ironsworn/templates/sf-truths-vue.hbs',
      id: 'setting-truths-dialog',
      resizable: true,
      width: 600,
      height: 700,
    })
  }

  async getVueData(): Promise<Record<string, any>> {
    return {
      truths: starforged['Setting Truths'],
    }
  }

  getComponents(): { [k: string]: Component } {
    return {
      'sf-truths': sfTruthsVue,
    }
  }
}
