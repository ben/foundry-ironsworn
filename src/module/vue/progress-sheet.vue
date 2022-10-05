<template>
  <div class="flexcol">
    <!-- HEADER -->
    <SheetHeaderBasic class="nogrow" :document="item" />

    <select
      class="nogrow"
      v-model="item.data.subtype"
      @change="subtypeChange"
      style="margin: 0.5rem 0"
    >
      <option value="vow">{{ $t('IRONSWORN.Vow') }}</option>
      <option value="progress">{{ $t('IRONSWORN.Progress') }}</option>
      <option value="bond">{{ $t('IRONSWORN.Connection') }}</option>
    </select>

    <hr class="nogrow" />
    <label class="checkbox nogrow">
      <input
        type="checkbox"
        v-model="item.data.completed"
        @change="saveChecks"
      />
      {{ $t('IRONSWORN.Completed') }}
    </label>
    <hr class="nogrow" />

    <div class="nogrow">
      <label class="checkbox">
        <input
          type="checkbox"
          v-model="item.data.hasTrack"
          @change="saveChecks"
        />
        {{ $t('IRONSWORN.Track') }}
      </label>

      <CollapseTransition>
        <div class="nogrow" v-if="item.data.hasTrack">
          <!-- RANK -->
          <div class="flexrow nogrow">
            <RankPips
              :current="item.data.rank"
              @click="setRank"
              style="margin-right: 1em"
            />
            <h4>{{ rankText }}</h4>
            <BtnFaicon
              class="block nogrow"
              v-if="editMode"
              icon="trash"
              @click="clearProgress"
            />
            <BtnFaicon
              class="block nogrow"
              icon="caret-right"
              @click="markProgress"
            />
          </div>
          <!-- PROGRESS -->
          <div class="flexrow track nogrow" style="margin-bottom: 1em">
            <ProgressTrack :ticks="item.data.current" :rank="item.data.rank" />
          </div>
        </div>
      </CollapseTransition>
    </div>

    <hr class="nogrow" />

    <div class="nogrow">
      <label class="checkbox">
        <input
          type="checkbox"
          v-model="item.data.hasClock"
          @change="saveChecks"
        />
        {{ $t('IRONSWORN.Clock') }}
      </label>

      <CollapseTransition>
        <div class="flexrow nogrow" v-if="item.data.hasClock">
          <div class="nogrow" style="margin: 0 1rem">
            <Clock
              :wedges="item.data.clockMax"
              :ticked="item.data.clockTicks"
              @click="setClock"
            />
          </div>
          <div class="flexcol">
            Segments:
            <select
              class="nogrow"
              v-model="item.data.clockMax"
              @change="clockMaxChange"
              style="margin: 0.5rem 0"
            >
              <option
                v-for="clockSize in [4, 6, 8, 10, 12]"
                :key="clockSize"
                :value="clockSize"
              >
                {{ clockSize }}
              </option>
            </select>
          </div>
        </div>
      </CollapseTransition>
    </div>

    <hr class="nogrow" />

    <!-- DESCRIPTION -->
    <MceEditor
      v-model="item.data.description"
      @save="saveDescription"
      @change="throttledSaveDescription"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { RANKS, RANK_INCREMENTS } from '../constants'
import { $ItemKey } from './provisions'
import RankPips from './components/rank-pips/rank-pips.vue'
import BtnFaicon from './components/buttons/btn-faicon.vue'
import Clock from './components/clock.vue'
import MceEditor from './components/mce-editor.vue'
import { throttle } from 'lodash'
import SheetHeaderBasic from './sheet-header-basic.vue'
import ProgressTrack from './components/progress/progress-track.vue'
import CollapseTransition from './components/transition/collapse-transition.vue'

const props = defineProps<{ item: any }>()
const $item = inject($ItemKey)

provide($ItemKey, props.item)

const editMode = computed(
  () => props.item.flags['foundry-ironsworn']?.['edit-mode']
)

const rankText = computed(() => game.i18n.localize(RANKS[props.item.data.rank]))

function setRank(rank) {
  $item?.update({ data: { rank } })
}

function clearProgress() {
  $item?.update({ 'data.current': 0 })
}

function markProgress() {
  const increment = RANK_INCREMENTS[props.item.data.rank]
  const newValue = Math.min(props.item.data.current + increment, 40)
  $item?.update({ 'data.current': newValue })
}

function subtypeChange() {
  $item?.update({ data: { subtype: props.item.data.subtype } })
}

function clockMaxChange() {
  $item?.update({ data: { clockMax: parseInt(props.item.data.clockMax) } })
}

function saveChecks() {
  $item?.update({
    data: {
      completed: props.item.data.completed,
      hasTrack: props.item.data.hasTrack,
      hasClock: props.item.data.hasClock,
    },
  })
}

function setClock(num) {
  $item?.update({ data: { clockTicks: num } })
}

function saveDescription() {
  $item?.update({ data: { description: props.item.data.description } })
}
const throttledSaveDescription = throttle(saveDescription, 1000)
</script>
