<template>
  <div class="item-row flexcol ironsworn__asset">
    <div class="asset-entry nogrow">
      <div class="flexrow">
        <h4 @click="toggle" style="margin: 0; line-height: 20px">
          {{ asset.name }}
        </h4>
        <btn-faicon
          class="block nogrow"
          v-if="editMode"
          icon="trash"
          @click="destroy"
        />
        <btn-faicon class="block nogrow" icon="edit" @click="edit" />
      </div>
    </div>
    <transition name="slide">
      <div class="flexcol asset-summary" v-if="expanded">
        <p v-for="(field, i) in asset.data.fields" :key="'field' + i">
          <strong>{{ field.name }}:</strong> {{ field.value }}
        </p>

        <ul>
          <with-rolllisteners
            v-for="(ability, i) in enabledAbilities"
            :key="'ability' + i"
            element="li"
            class="flexrow"
            @moveclick="moveclick"
          >
            <!-- TODO: redo as list style -->
            <i class="fas fa-circle nogrow" style="margin: 1rem 0.5rem 0 0"></i>
            <div v-html="$enrichHtml(ability.description)"></div>
            <clock
              v-if="ability.hasClock"
              class="nogrow"
              style="flex-basis: 100px"
              :wedges="ability.clockMax"
              :ticked="ability.clockTicks"
              @click="setAbilityClock(i, $event)"
            />
          </with-rolllisteners>
        </ul>

        <div class="flexcol condition-meter" v-if="asset.data.track.enabled">
          <btn-rollstat
            class="juicy text flexrow"
            :item="asset"
            attr="track"
            :statLabel="asset.data.track.name"
          >
            {{ asset.data.track.name }}
          </btn-rollstat>
          <asset-track :item="asset" />
        </div>

        <div
          class="flexcol stack nogrow"
          style="margin-top: 5px"
          v-if="asset.data.exclusiveOptions.length > 0"
        >
          <asset-exclusiveoption
            v-for="(opt, i) in asset.data.exclusiveOptions"
            :key="'option' + i"
            :opt="opt"
            @click="exclusiveOptionClick(i)"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="less" scoped>
.condition-meter {
  gap: 3px;
}
.slide-enter-active,
.slide-leave-active {
  max-height: 350px;
}
.stat-roll {
  text-transform: uppercase;
  line-height: 1;
}
</style>

<style lang="less">
.condition-meter .icon-button .button-text {
  text-align: left;
}
</style>

<script setup lang="ts">
import { computed, inject, provide, Ref } from 'vue'
import { RollDialog } from '../../../helpers/rolldialog'
import { AssetAbility, AssetDataPropertiesData } from '../../../item/itemtypes'
import BtnFaicon from '../buttons/btn-faicon.vue'
import BtnRollstat from '../buttons/btn-rollstat.vue'
import AssetTrack from './asset-track.vue'
import AssetExclusiveoption from './asset-exclusiveoption.vue'
import Clock from '../clock.vue'
import WithRolllisteners from '../with-rolllisteners.vue'
import { $ActorKey, $ItemKey } from '../../provisions'
import { defaultActor } from '../../../helpers/actors'

const props = defineProps<{ asset: any }>()
const actor = inject('actor') as Ref

const $actor = inject($ActorKey)
const foundryItem = $actor
  ? $actor?.items.find((x) => x.id === props.asset._id)
  : game.items?.get(props.asset._id)
provide($ItemKey, foundryItem)

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
function rollTrack() {
  RollDialog.show({
    actor: $actor,
    asset: foundryItem,
    stat: 'track',
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
  let actorWithMoves = $actor
  if ($actor?.type !== 'character') {
    actorWithMoves = defaultActor()
  }
  actorWithMoves?.moveSheet?.render(true)
  actorWithMoves?.moveSheet?.highlightMove(item)
}
function setAbilityClock(abilityIdx: number, clockTicks: number) {
  const abilities = Object.values(props.asset.data.abilities) as AssetAbility[]
  abilities[abilityIdx] = { ...abilities[abilityIdx], clockTicks }
  foundryItem?.update({ data: { abilities } })
}
</script>
