<template>
  <div class="flexcol">
    <!-- HEADER -->
    <SheetHeaderBasic class="nogrow" :document="item" />

    <div class="flexrow nogrow" style="margin: 0.5rem 0">
      <RankPips
        class="nogrow"
        :current="item.data.rank"
        @click="setRank"
        style="margin-right: 1em"
      />
      <h4 style="margin: 0; line-height: 22px">{{ rankText }}</h4>
      <label class="checkbox nogrow">
        <input
          type="checkbox"
          v-model="item.data.completed"
          @change="saveChecks"
        />
        {{ $t('IRONSWORN.Completed') }}
      </label>
    </div>

    <select class="nogrow" v-model="item.data.subtype" @change="subtypeChange">
      <option value="vow">{{ $t('IRONSWORN.Vow') }}</option>
      <option value="progress">{{ $t('IRONSWORN.Progress') }}</option>
      <option value="bond">{{ $t('IRONSWORN.Connection') }}</option>
    </select>

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
          <div
            class="flexrow nogrow"
            style="justify-content: flex-end; margin-bottom: 0.25rem"
          >
            <BtnFaicon
              class="block"
              v-if="item.data.hasTrack"
              icon="caret-left"
              @click="retreat"
              :tooltip="$t('IRONSWORN.UnmarkProgress')"
            />
            <BtnFaicon
              class="block"
              v-if="item.data.hasTrack"
              icon="caret-right"
              @click="advance"
              :tooltip="$t('IRONSWORN.MarkProgress')"
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
    <MceEditor v-model="item.data.description" @save="saveDescription" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { RANKS } from '../constants'
import { $ItemKey, ItemKey } from './provisions'
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

provide(
  ItemKey,
  computed(() => props.item)
)

const rankText = computed(() => game.i18n.localize(RANKS[props.item.data.rank]))

function setRank(rank) {
  $item?.update({ data: { rank } })
}

function advance() {
  $item?.markProgress(1)
}
function retreat() {
  $item?.markProgress(-1)
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
</script>
