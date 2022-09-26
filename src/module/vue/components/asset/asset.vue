<template>
  <article
    class="item-row flexcol ironsworn__asset"
    :aria-expanded="expanded"
    :style="`--ironsworn-thematic-color: ${
      ThemeColors[props.asset?.data?.category] ?? 'black'
    };`"
  >
    <header class="asset-header nogrow flexrow">
      <h4 @click="toggle" style="" class="asset-title" :aria-controls="bodyId">
        {{ asset.name }}
      </h4>
      <btn-faicon
        class="block nogrow"
        v-if="editMode"
        icon="trash"
        @click="destroy"
      />
      <btn-faicon class="block nogrow" icon="edit" @click="edit" />
    </header>

    <transition name="slide">
      <section
        v-if="expanded"
        class="flexcol asset-body"
        :aria-expanded="expanded"
        :id="bodyId"
      >
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
            class="asset-ability theme-bullet"
            @moveclick="moveclick"
          >
            <section
              class="asset-ability-text flexcol"
              v-html="$enrichHtml(ability.description)"
            ></section>
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

        <article
          class="flexcol condition-meter"
          v-if="asset.data.track.enabled"
        >
          <btn-rollstat
            class="juicy text flexrow"
            :item="asset"
            attr="track"
            :statLabel="asset.data.track.name"
          >
            {{ asset.data.track.name }}
          </btn-rollstat>
          <asset-track :item="asset" />
        </article>

        <section
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
        </section>
      </section>
    </transition>
  </article>
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
.theme-bullet {
  &:before {
    content: '';
    display: block;
    mask-repeat: no-repeat;
    background-repeat: no-repeat;
    mask-position: center;
    background-position: center;
    background-color: currentColor;
  }
}
.theme-starforged .theme-bullet {
  &:before {
    aspect-ratio: (sqrt(3) / 2);
    background-image: url('systems/foundry-ironsworn/assets/misc/hex-checkbox-unchecked.svg');
    mask-image: url('systems/foundry-ironsworn/assets/misc/hex-checkbox-checked.svg');
    height: 1.25em;
  }
}
.theme-ironsworn .theme-bullet {
  &:before {
    aspect-ratio: 1;
    border-radius: 50%;
    border-width: 2px;
    height: 1em;
    margin-top: 0.15em;
  }
}
.ironsworn__asset {
  @asset_spacer: 0.5em;
  @background_height: 100px;
  position: relative;
  overflow: hidden;
  transition: var(--std-animation);
  & > * {
    z-index: 2;
  }
  &:before {
    display: block;
    pointer-events: none;
    content: '';
    mask-image: url(systems/foundry-ironsworn/assets/asset-backgrounds/hex-asset-background.svg);
    background: var(--ironsworn-thematic-color);
    position: absolute;
    right: 0;
    top: 0;
    height: @background_height;
    aspect-ratio: 32.172588/29.659111;
    z-index: 1;
    mask-repeat: no-repeat;
    transition: var(--std-animation);
  }
  &[aria-expanded='false']:before {
    height: (@background_height*0.63);
    right: -(@background_height*0.15);
  }
  .asset-header {
    .asset-title {
      display: flex;
      margin: 0;
      font-size: var(--font-size-14);
      line-height: 1;
      align-items: center;
    }
  }
  .asset-body {
    transition: var(--std-animation);
    overflow: hidden;
    padding: 0.25em;
    gap: @asset_spacer;
    &[aria-expanded='false'] {
      height: 0px;
    }
    .asset-fields {
      margin: 0;
      display: flex;
      flex-direction: column;
      .asset-field-label,
      .asset-field-value {
        padding: 0;
        margin: 0;
      }
      .asset-field {
        display: flex;
        flex-direction: row;
        gap: 0.25em;
        margin-right: 100px;
      }
      .asset-field {
        flex-grow: 0;
      }
      .asset-field-value {
        flex-grow: 1;
        padding: 0 0.25em;
        border-bottom: 1px solid currentColor;
      }
    }
    .asset-abilities {
      padding-left: @asset_spacer;
      // padding-right: (@asset_spacer*2);
      gap: @asset_spacer;
      li {
        list-style: none;
        display: flex;
        flex-direction: row;
        gap: @asset_spacer;
        // &::before {
        //   content: '';
        //   display: block;
        //   aspect-ratio: (sqrt(3) / 2);
        //   background-image: url('systems/foundry-ironsworn/assets/misc/hex-checkbox-unchecked.svg');
        //   background-color: var(--ironsworn-color-thematic);
        //   mask-image: url('systems/foundry-ironsworn/assets/misc/hex-checkbox-checked.svg');
        //   height: 1.25em;
        //   mask-repeat: no-repeat;
        //   background-repeat: no-repeat;
        //   mask-position: center;
        //   background-position: center;
        // }
      }
    }
    .asset-ability-text {
      gap: 0.25em;
      p {
        margin: 0;
      }
    }
    ul,
    ol {
      margin: 0;
    }
  }
  .condition-meter .icon-button .button-text {
    text-align: left;
  }
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

enum ThemeColors {
  'Command Vehicle' = '#9aa3ad',
  Module = '#7f5a90',
  'Support Vehicle' = '#495790',
  Path = '#3f7faa',
  Companion = '#3d8b8a',
  Deed = '#40834f',
}

const props = defineProps<{ asset: any }>()
const actor = inject('actor') as Ref

const $actor = inject($ActorKey)
const foundryItem = $actor
  ? $actor?.items.find((x) => x.id === props.asset._id)
  : game.items?.get(props.asset._id)
provide($ItemKey, foundryItem)

const bodyId = computed(() => `asset-body-${props.asset?._id}`)

const currentTheme = computed(() =>
  game.settings.get('foundry-ironsworn', 'starforged')
)

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
