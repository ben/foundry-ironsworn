<template>
  <article
    class="item-row ironsworn__asset"
    :class="{ [`asset-${$actor?.toolset}`]: true }"
    :aria-expanded="expanded"
    :style="
      props.asset?.data?.color
        ? `--ironsworn-color-thematic: ${props.asset?.data?.color}`
        : undefined
    "
  >
    <header class="asset-header nogrow flexrow">
      <button
        type="button"
        @click="toggle"
        :aria-controls="bodyId"
        class="clickable text asset-expand-toggle"
      >
        <h4 class="asset-title">
          {{ asset.name }}
        </h4>
        <span class="asset-type" aria-label="asset type">
          {{ asset.data.category }}
        </span>
      </button>
      <div class="asset-controls flexrow nogrow">
        <btn-faicon
          class="block nogrow"
          v-if="editMode"
          icon="trash"
          @click="destroy"
        />
        <btn-faicon class="block nogrow" icon="edit" @click="edit" />
      </div>
    </header>

    <CollapseTransition>
      <section
        v-if="expanded"
        class="asset-body flexcol"
        :aria-expanded="expanded"
        :id="bodyId"
      >
        <with-rolllisteners
          element="div"
          v-html="$enrichHtml(asset.data.description ?? '')"
          v-if="asset.data.description"
          @moveclick="moveclick"
        />
        <div v-html="$enrichHtml(asset.data.requirement ?? '')"></div>

        <dl class="asset-fields" v-if="asset.data.fields?.length">
          <div
            class="asset-field"
            v-for="(field, i) in asset.data.fields"
            :key="'field' + i"
          >
            <dt class="asset-field-label">{{ field.name }}</dt>
            <dd class="asset-field-value">{{ field.value }}</dd>
          </div>
        </dl>
        <ul class="asset-abilities flexcol">
          <with-rolllisteners
            v-for="(ability, i) in enabledAbilities"
            :key="'ability' + i"
            element="li"
            :class="`asset-ability marked bullet-${$actor?.toolset}`"
            @moveclick="moveclick"
          >
            <div
              class="asset-ability-text flexcol"
              v-html="$enrichHtml(ability.description)"
            ></div>
            <clock
              v-if="ability.hasClock"
              class="asset-ability-clock"
              :wedges="ability.clockMax"
              :ticked="ability.clockTicks"
              @click="setAbilityClock(i, $event)"
            />
          </with-rolllisteners>
        </ul>

        <div class="flexrow nogrow">
          <ConditionMeterSlider
            v-if="asset.data.track.enabled"
            sliderStyle="horizontal"
            class="asset-condition-meter"
            documentType="Item"
            attr="track.current"
            :current-value="asset.data.track.current"
            :max="asset.data.track.max"
            :min="0"
            :statLabel="asset.data.track.name"
            labelPosition="left"
            :read-only="false"
          />
          <AssetConditions :asset="asset" />
        </div>

        <section
          class="flexcol stack nogrow"
          v-if="asset.data.exclusiveOptions.length > 0"
        >
          <asset-exclusiveoption
            v-for="(opt, i) in asset.data.exclusiveOptions"
            :key="'option' + i"
            :opt="opt"
            @click="exclusiveOptionClick(i)"
          />
        </section>
      </section>
    </CollapseTransition>
  </article>
</template>

<script setup lang="ts">
import { computed, inject, provide, Ref } from 'vue'
import { AssetAbility, AssetDataPropertiesData } from '../../../item/itemtypes'
import BtnFaicon from '../buttons/btn-faicon.vue'
import AssetExclusiveoption from './asset-exclusiveoption.vue'
import Clock from '../clock.vue'
import WithRolllisteners from '../with-rolllisteners.vue'
import { $ActorKey, $ItemKey, ActorKey } from '../../provisions'
import { defaultActor } from '../../../helpers/actors'
import CollapseTransition from '../transition/collapse-transition.vue'
import ConditionMeterSlider from '../resource-meter/condition-meter.vue'
import AssetConditions from './asset-conditions.vue'

const props = defineProps<{ asset: any }>()
const actor = inject(ActorKey) as Ref

const $actor = inject($ActorKey)
const foundryItem = $actor
  ? $actor?.items.find((x) => x.id === props.asset._id)
  : game.items?.get(props.asset._id)
provide($ItemKey, foundryItem)

const bodyId = computed(() => `asset-body-${props.asset?._id}`)

const expanded = computed(() => {
  return props.asset?.flags['foundry-ironsworn']?.expanded || false
})
const editMode = computed(() => {
  return actor.value.flags['foundry-ironsworn']?.['edit-mode']
})
const enabledAbilities = computed(() => {
  const data = props.asset.data as AssetDataPropertiesData
  const abilities = Object.values(data.abilities)
  return abilities.filter((x) => x.enabled)
})
const actingActor = computed(() => {
  if (actor.value.type === 'character') return actor.value
  return defaultActor()?.toObject(false)
})

function toggle() {
  foundryItem?.setFlag(
    'foundry-ironsworn',
    'expanded',
    !props.asset?.flags['foundry-ironsworn']?.expanded
  )
}
function edit() {
  foundryItem?.sheet?.render(true)
  return false
}
function destroy() {
  Dialog.confirm({
    title: game.i18n.localize('IRONSWORN.DeleteAsset'),
    content: `<p><strong>${game.i18n.localize(
      'IRONSWORN.ConfirmDelete'
    )}</strong></p>`,
    yes: () => foundryItem?.delete(),
    defaultYes: false,
  })
}
function exclusiveOptionClick(selectedIdx) {
  const options = props.asset.data.exclusiveOptions
  for (let i = 0; i < options.length; i++) {
    options[i].selected = i === selectedIdx
  }
  foundryItem?.update({ data: { exclusiveOptions: options } })
}
function moveclick(item) {
  CONFIG.IRONSWORN.emitter.emit('highlightMove', item.id)
}
function setAbilityClock(abilityIdx: number, clockTicks: number) {
  const abilities = Object.values(props.asset.data.abilities) as AssetAbility[]
  abilities[abilityIdx] = { ...abilities[abilityIdx], clockTicks }
  foundryItem?.update({ data: { abilities } })
}

function toggleCondition(idx: number) {
  const { conditions } = props.asset.data
  conditions[idx].ticked = !conditions[idx].ticked
  foundryItem?.update({ data: { conditions } })
}
</script>
