<template>
  <article class="flexcol ironsworn__asset" :class="articleClasses">
    <!--
        Semi-edit view:
        * Text entry for field VALUES (not names)
        * Checkboxes for abilities, settable clocks
        * Selection for exclusive options
        * Track: name and value only
        * Conditions: checkboxes only
       -->

    <header class="asset-header nogrow">
      <span class="asset-type" aria-label="asset type">
        {{ item.system.category }}
      </span>
    </header>

    <section class="asset-body flexcol">
      <!-- DESCRIPTION -->
      <WithRollListeners
        element="div"
        @moveclick="moveClick"
        class="nogrow"
        v-if="item.system.description"
        v-html="$enrichHtml(item.system.description)"
      />

      <!-- FIELDS -->
      <div
        class="form-group nogrow"
        v-for="(field, i) in item.system.fields"
        :key="`field${i}`"
      >
        <label>{{ field.name }}</label>
        <input type="text" v-model="field.value" @blur="saveFields" />
      </div>

      <!-- REQUIREMENT -->
      <p
        class="nogrow"
        v-if="item.system.requirement"
        v-html="$enrichMarkdown(item.system.requirement)"
      ></p>

      <!-- ABILITIES -->
      <div class="asset-abilities flexcol nogrow">
        <div
          v-for="(ability, i) in item.system.abilities"
          :key="`ability${i}`"
          :class="{
            flexrow: true,
            marked: ability.enabled,
          }"
          @click="toggleAbility(i)"
        >
          <div class="flexrow nogrow bullet-wrapper">
            <div
              :class="{
                nogrow: true,
                'asset-ability-bullet': true,
                'asset-ability-bullet-marked': ability.enabled,
                [`asset-ability-bullet-${toolset}`]: true,
                [`asset-ability-bullet-${toolset}-marked`]: ability.enabled,
              }"
            />
          </div>
          <WithRollListeners
            element="div"
            @moveclick="moveClick"
            class="asset-ability-text flexcol"
            v-html="$enrichHtml(ability.description)"
          >
          </WithRollListeners>
          <Clock
            v-if="ability.hasClock"
            class="asset-ability-clock"
            :wedges="ability.clockMax"
            :ticked="ability.clockTicks"
            @click="setAbilityClock(i, $event)"
          />
        </div>
      </div>

      <!-- OPTIONS -->
      <section
        class="flexcol stack nogrow"
        v-if="item.system.exclusiveOptions.length > 0"
      >
        <AssetExclusiveoption
          v-for="(opt, i) in item.system.exclusiveOptions"
          :key="'option' + i"
          :opt="opt"
          @click="exclusiveOptionClick(i)"
        />
      </section>

      <div class="flexrow nogrow">
        <!-- TRACK -->
        <ConditionMeterSlider
          v-if="item.system.track.enabled"
          sliderStyle="horizontal"
          class="asset-condition-meter"
          documentType="Item"
          attr="track.current"
          :current-value="item.system.track.current"
          :max="item.system.track.max"
          :min="0"
          :statLabel="item.system.track.name"
          labelPosition="left"
          :read-only="false"
        />

        <!-- CONDITIONS -->
        <AssetConditions :asset="item" />
      </div>
    </section>
  </article>
</template>

<style lang="less" scoped>
.bullet-wrapper {
  flex-basis: 1.5em;
  align-content: flex-start;
  padding-top: 0.05em;
}

.asset-ability-bullet-ironsworn {
  border: var(--ironsworn-border-width-md) solid var(--ironsworn-color-border);
  height: 15px;
}

.asset-ability-bullet-starforged {
  border: var(--ironsworn-border-width-md) solid var(--ironsworn-color-border);
  background-color: var(--ironsworn-color-border);
  height: 1em;
}
</style>

<style lang="less" module>
.ironsworn__asset {
  --ironsworn-color-thematic: v-bind('item.system.color');

  margin: var(--ironsworn-spacer-xl) 0;
  padding: var(--ironsworn-spacer-md);
}
</style>

<script lang="ts" setup>
import { computed, ComputedRef, inject, useCssModule } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'
import { AssetAbility } from '../../../item/itemtypes'
import WithRollListeners from '../with-rolllisteners.vue'
import Clock from '../clock.vue'
import ConditionMeterSlider from '../resource-meter/condition-meter.vue'
import AssetExclusiveoption from './asset-exclusiveoption.vue'
import AssetConditions from './asset-conditions.vue'

const $item = inject($ItemKey)
const item = inject(ItemKey) as ComputedRef

const toolset = computed<'ironsworn' | 'starforged' | undefined>(
  () => $item?.actor?.toolset ?? 'ironsworn'
)

const cssModule = useCssModule()
const articleClasses = computed(() => ({
  [cssModule.ironsworn__asset]: true,
  [`asset-${toolset.value ?? 'ironsworn'}`]: true,
  [`asset-${toolset.value}`]: true,
}))

function saveFields() {
  const fields = item.value?.system.fields
  $item?.update({ system: { fields } })
}

function toggleAbility(i: number) {
  const { abilities } = item.value.system
  abilities[i].enabled = !abilities[i].enabled
  $item?.update({ system: { abilities } })
}

function setAbilityClock(abilityIdx: number, clockTicks: number) {
  const abilities = Object.values(item.value.system.abilities) as AssetAbility[]
  abilities[abilityIdx] = { ...abilities[abilityIdx], clockTicks }
  $item?.update({ system: { abilities } })
}

function exclusiveOptionClick(selectedIdx: number) {
  const { exclusiveOptions } = item.value.system
  for (let i = 0; i < exclusiveOptions.length; i++) {
    exclusiveOptions[i].selected = i === selectedIdx
  }
  $item?.update({ system: { exclusiveOptions } })
}

function moveClick(item) {
  CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}

function toggleCondition(idx: number) {
  const { conditions } = item.value.system
  conditions[idx].ticked = !conditions[idx].ticked
  $item?.update({ system: { conditions } })
}
</script>
