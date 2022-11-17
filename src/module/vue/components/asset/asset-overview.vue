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
        {{ item.data.category }}
      </span>
    </header>

    <section class="asset-body flexcol">
      <!-- DESCRIPTION -->
      <div
        class="nogrow"
        v-if="item.data.description"
        v-html="$enrichHtml(item.data.description)"
      ></div>

      <!-- FIELDS -->
      <div
        class="form-group nogrow"
        v-for="(field, i) in item.data.fields"
        :key="`field${i}`"
      >
        <label>{{ field.name }}</label>
        <input type="text" v-model="field.value" @blur="saveFields" />
      </div>

      <!-- REQUIREMENT -->
      <p
        class="nogrow"
        v-if="item.data.requirement"
        v-html="$enrichMarkdown(item.data.requirement)"
      ></p>

      <!-- ABILITIES -->
      <div class="asset-abilities flexcol nogrow">
        <div
          v-for="(ability, i) in item.data.abilities"
          :key="`ability${i}`"
          :class="{
            flexrow: true,
            marked: ability.enabled,
          }"
          @click="toggleAbility(i)"
        >
          <div
            class="flexrow nogrow"
            style="
              flex-basis: 30px;
              align-content: flex-start;
              padding-top: 0.05em;
            "
          >
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
        v-if="item.data.exclusiveOptions.length > 0"
      >
        <AssetExclusiveoption
          v-for="(opt, i) in item.data.exclusiveOptions"
          :key="'option' + i"
          :opt="opt"
          @click="exclusiveOptionClick(i)"
        />
      </section>

      <div class="flexrow nogrow">
        <!-- TRACK -->
        <ConditionMeterSlider
          v-if="item.data.track.enabled"
          sliderStyle="horizontal"
          class="asset-condition-meter"
          documentType="Item"
          attr="track.current"
          :current-value="item.data.track.current"
          :max="item.data.track.max"
          :min="0"
          :statLabel="item.data.track.name"
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
.asset-ability-bullet-ironsworn {
  height: 15px;
  border: 1px solid var(--ironsworn-color-border);
}

.asset-ability-bullet-starforged {
  height: 1em;
}
</style>

<style lang="less" module>
.ironsworn__asset {
  margin: 10px 0;
  padding: 5px;
  --ironsworn-color-thematic: v-bind(item.data.color || '#000');
}

.asset-ability-clock {
  min-width: 40px;
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
  const fields = item.value?.data.fields
  $item?.update({ data: { fields } })
}

function toggleAbility(i: number) {
  const { abilities } = item.value.data
  abilities[i].enabled = !abilities[i].enabled
  $item?.update({ data: { abilities } })
}

function setAbilityClock(abilityIdx: number, clockTicks: number) {
  const abilities = Object.values(item.value.data.abilities) as AssetAbility[]
  abilities[abilityIdx] = { ...abilities[abilityIdx], clockTicks }
  $item?.update({ data: { abilities } })
}

function exclusiveOptionClick(selectedIdx: number) {
  const { exclusiveOptions } = item.value.data
  for (let i = 0; i < exclusiveOptions.length; i++) {
    exclusiveOptions[i].selected = i === selectedIdx
  }
  $item?.update({ data: { exclusiveOptions } })
}

function moveClick(item) {
  CONFIG.IRONSWORN.emitter.emit('highlightMove', item.id)
}

function toggleCondition(idx: number) {
  const { conditions } = item.value.data
  conditions[idx].ticked = !conditions[idx].ticked
  $item?.update({ data: { conditions } })
}
</script>
