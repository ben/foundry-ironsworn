<template>
  <label
    class="checkbox"
    :data-tooltip="state.hintText"
    :class="{ 'condition-hint': !!state.hintText }"
  >
    <input
      type="checkbox"
      @change="input"
      :checked="actor.system.debility[name]"
    />
    {{ $t(`IRONSWORN.${$capitalize(name)}`) }}
  </label>
</template>

<style lang="less" scoped>
.condition-hint {
  text-shadow: 0 0 5px var(--ironsworn-color-warning);
}
</style>

<script lang="ts" setup>
import { capitalize, inject, nextTick, reactive, Ref } from 'vue'
import { actorsOrAssetsWithConditionEnabled } from '../../../helpers/globalConditions'
import { IronswornSettings } from '../../../helpers/settings'
import { AssetDataPropertiesData } from '../../../item/itemtypes'
import { $ActorKey, ActorKey } from '../../provisions'

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const props = defineProps<{
  name: string
  global?: boolean
  globalHint?: boolean
}>()

const state = reactive<{ hintText?: string }>({})

async function input(ev: Event) {
  const impactKey = 'debility'
  const value = (ev.currentTarget as HTMLInputElement)?.checked
  const data = {
    system: {
      [impactKey]: {
        [props.name]: value,
      },
    },
  }
  await $actor?.update(data)
  await nextTick()
  const numDebilitiesMarked = Object.values(actor.value.system.debility).filter(
    (x) => x === true
  ).length
  await $actor?.update({
    system: {
      momentumMax: 10 - numDebilitiesMarked,
      momentumReset: Math.max(0, 2 - numDebilitiesMarked),
    },
  })

  if (props.global) {
    await IronswornSettings.updateGlobalAttribute(data, [
      'character',
      'starship',
    ])
  }

  if (props.globalHint) {
    CONFIG.IRONSWORN.emitter.emit('globalConditionChanged', {
      name: props.name,
      enabled: value,
    })
  }
}

// We can't watch this directly, we just have to trust that a broadcast will happen
// when it changes
CONFIG.IRONSWORN.emitter.on('globalConditionChanged', ({ name }) => {
  if (name === props.name) {
    refreshGlobalHint()
  }
})

const i18nCondition = game.i18n.localize(`IRONSWORN.${capitalize(props.name)}`)
function refreshGlobalHint() {
  const { actors, assets } = actorsOrAssetsWithConditionEnabled(props.name)
  const names = [
    ...actors.map((x) => x.name),
    ...assets.map((x) => {
      const assetData = x.system as AssetDataPropertiesData
      const nameField = assetData.fields.find((x) => {
        const downcase = x.name.toLowerCase()
        if (downcase === game.i18n.localize('IRONSWORN.Name').toLowerCase())
          return true
        if (downcase === 'name') return true
        return false
      })
      return nameField?.value || x.name
    }),
  ].filter((x) => x !== actor.value.name)

  if (names.length == 0) {
    state.hintText = undefined
  } else if (names.length == 1) {
    // Condition only set on one other actor
    state.hintText = game.i18n.format('IRONSWORN.ConditionSetOnOne', {
      condition: i18nCondition,
      name: names[0],
    })
  } else {
    // This condition is set on several other actors, display them as a list
    state.hintText = `
    <p>${game.i18n.format('IRONSWORN.ConditionSetOnMany', {
      condition: i18nCondition,
    })}</p>
    <ul>
      ${names.map((x) => `<li>${x}</li>`).join('\n')}
    </ul>
    `.trim()
  }
}
if (props.globalHint) refreshGlobalHint()
</script>
