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
        <div
          v-html="$enrichHtml(asset.data.description ?? '')"
          v-if="asset.data.description"
        ></div>
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
        <ConditionMeterSlider
          v-if="asset.data.track.enabled"
          sliderStyle="horizontal"
          class="asset-condition-meter nogrow"
          documentType="Item"
          attr="track.current"
          :current-value="asset.data.track.current"
          :max="asset.data.track.max"
          :min="0"
          :statLabel="asset.data.track.name"
          labelPosition="left"
          :read-only="false"
        />
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

<style lang="less">
@asset_spacer: 0.5em;

.ironsworn__asset {
  overflow: hidden;
  transition: var(--std-animation);
  .asset-header {
    transition: var(--std-animation);
    gap: @asset_spacer;
    align-items: center;
    .asset-expand-toggle {
      display: flex;
      gap: @asset_spacer;
      background: none;
      box-shadow: none !important;
      .asset-title {
        margin: 0;
        font-size: var(--font-size-14);
        font-weight: bold;
        letter-spacing: 0.02em;
        word-spacing: 0.02em;
        line-height: 1;
      }
      &:not(:hover) .asset-type {
        color: var(--ironsworn-color-thematic);
      }
      .asset-type {
        flex-grow: 0;
        line-height: 1;
        font-style: italic;
        transition: var(--std-animation);
      }
    }
    .asset-controls {
      justify-items: flex-end;
      display: flex;
      flex-grow: 0;
      flex-wrap: nowrap;
    }
  }
  .asset-body {
    transition: var(--std-animation);
    overflow: hidden;
    padding: (@asset_spacer / 2);
    gap: @asset_spacer;
    .asset-fields {
      margin: 0;
      display: flex;
      flex-direction: column;
      .asset-field {
        display: flex;
        flex-direction: row;
        gap: (@asset_spacer / 2);
        flex-grow: 0;
        border-bottom: 1px solid;
        border-bottom-color: var(--ironsworn-color-thematic);
        .asset-field-label {
          padding: 0;
          margin: 0;
        }
        .asset-field-value {
          margin: 0;
          flex-grow: 1;
          padding: 0 (@asset_spacer / 2);
        }
      }
    }
    .asset-abilities {
      padding-left: @asset_spacer;
      gap: @asset_spacer;
      .asset-ability {
        list-style: none;
        display: flex;
        flex-direction: row;
        gap: @asset_spacer;
      }
    }
  }

  .asset-ability-clock {
    min-width: 40px;
  }
  .asset-ability-text {
    // flex-grow: 2;
    // gap: (@asset_spacer / 2);
    p {
      margin: 0;
    }
  }
  ul,
  ol {
    margin: 0;
  }
}
.asset-condition-meter {
  gap: 3px;
  .icon-button .button-text {
    text-align: left;
  }
}

@hexagon_aspect_ratio: (sqrt(3) / 2);
@hex_deco_aspect_ratio: 24 / 28;
@hex_deco_expanded_height: 50px;
@hex_deco_collapsed_height: 32px;
.asset-ironsworn,
.asset-starforged {
  // common properties for asset ability bullet/checkbox
  .asset-ability {
    &:before {
      content: '';
      display: block;
      mask-repeat: no-repeat;
      background-repeat: no-repeat;
      mask-position: center;
      background-position: center;
    }

    &.marked:before {
      background-color: currentColor;
    }
  }
}
.asset-ironsworn {
  .asset-ability {
    &:before {
      aspect-ratio: 1;
      border-radius: 50%;
      border-width: 2px;
      height: 0.75em;
      margin-top: 0.15em;
    }
  }
}
.asset-starforged {
  position: relative;
  & > * {
    z-index: 2;
  }
  &:before {
    display: block;
    pointer-events: none;
    content: '';
    mask-image: url(/assets/misc/hex-deco.svg);
    background: var(--ironsworn-color-thematic);
    position: absolute;
    aspect-ratio: @hex_deco_aspect_ratio;
    z-index: 1;
    mask-repeat: no-repeat;
    // transition: var(--std-animation);
    transform: scaleX(-1);
    height: @hex_deco_collapsed_height;
    top: -($height * 0.09);
    right: ($height * 0.03);
  }
  .asset-header {
    padding-right: (@hex_deco_collapsed_height * @hex_deco_aspect_ratio);
    // hex frame style for later use if asset icons added
    // .asset-icon {
    //   clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
    //   aspect-ratio: @hexagon_aspect_ratio;
    //   border: 0;
    //   padding: 3px;
    // }
  }
  .asset-abilities {
    .asset-ability {
      &:before {
        aspect-ratio: @hexagon_aspect_ratio;
        background-image: url('/assets/misc/hex-checkbox-unchecked.svg');
        mask-image: url('/assets/misc/hex-checkbox-unchecked.svg');
        height: 1em;
        margin-top: 0.15em;
      }
      &.marked:before {
        mask-image: url('/assets/misc/hex-checkbox-checked.svg');
      }
    }
  }
}
</style>

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
</script>
