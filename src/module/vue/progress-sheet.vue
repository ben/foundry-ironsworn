<template>
  <div class="flexcol">
    <!-- HEADER -->
    <SheetHeaderBasic class="nogrow" :document="item" />

    <div class="flexrow nogrow" style="margin: 0.5rem 0">
      <RankPips
        class="nogrow"
        :current="item.system.rank"
        @click="setRank"
        style="margin-right: 1em"
      />
      <h4 style="margin: 0; line-height: 22px">{{ rankText }}</h4>
      <label class="checkbox nogrow">
        <input
          type="checkbox"
          v-model="item.system.completed"
          @change="saveChecks"
        />
        {{ $t('IRONSWORN.Completed') }}
      </label>
    </div>

    <select
      class="nogrow"
      v-model="item.system.subtype"
      @change="subtypeChange"
    >
      <option value="vow">{{ $t('IRONSWORN.Vow') }}</option>
      <option value="progress">{{ $t('IRONSWORN.Progress') }}</option>
      <option value="bond">{{ $t('IRONSWORN.Connection') }}</option>
    </select>

    <hr class="nogrow" />

    <div class="nogrow">
      <label class="checkbox">
        <input
          type="checkbox"
          v-model="item.system.hasTrack"
          @change="saveChecks"
        />
        {{ $t('IRONSWORN.Track') }}
      </label>

      <CollapseTransition>
        <div class="nogrow" v-if="item.system.hasTrack">
          <div
            class="flexrow nogrow"
            style="justify-content: flex-end; margin-bottom: 0.25rem"
          >
            <BtnFaicon
              class="block"
              v-if="item.system.hasTrack"
              icon="caret-left"
              @click="retreat"
              :tooltip="$t('IRONSWORN.UnmarkProgress')"
            />
            <BtnFaicon
              class="block"
              v-if="item.system.hasTrack"
              icon="caret-right"
              @click="advance"
              :tooltip="$t('IRONSWORN.MarkProgress')"
            />
          </div>
          <!-- PROGRESS -->
          <div class="flexrow track nogrow" style="margin-bottom: 1em">
            <ProgressTrack
              :ticks="item.system.current"
              :rank="item.system.rank"
            />
          </div>
        </div>
      </CollapseTransition>
    </div>

    <hr class="nogrow" />

    <div class="nogrow">
      <label class="checkbox">
        <input
          type="checkbox"
          v-model="item.system.hasClock"
          @change="saveChecks"
        />
        {{ $t('IRONSWORN.Clock') }}
      </label>

      <CollapseTransition>
        <div class="flexrow nogrow" v-if="item.system.hasClock">
          <div class="nogrow" style="margin: 0 1rem">
            <Clock
              :wedges="item.system.clockMax"
              :ticked="item.system.clockTicks"
              @click="setClock"
            />
          </div>
          <div class="flexcol">
            {{ $t('IRONSWORN.Segments') }}:
            <select
              class="nogrow"
              v-model="item.system.clockMax"
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
    <MceEditor v-model="item.system.description" @save="saveDescription" />

    <button
      class="button nogrow"
      :class="$style.danger"
      type="button"
      @click="destroy"
    >
      {{ $t('IRONSWORN.DeleteItem') }}
    </button>
  </div>
</template>

<style lang="less" module>
button.danger {
  color: var(--ironsworn-color-danger);
  border: 1px solid;
  border-radius: 5px;
  border-color: var(--ironsworn-color-danger);
  transition: all ease 0.2s;

  &:hover {
    background-color: var(--ironsworn-color-danger);
    color: var(--ironsworn-color-danger-inverted);
    border-color: var(--ironsworn-color-danger-inverted);
  }
}
</style>

<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { RANKS } from '../constants'
import { $ItemKey, ItemKey } from './provisions'
import RankPips from './components/rank-pips/rank-pips.vue'
import BtnFaicon from './components/buttons/btn-faicon.vue'
import Clock from './components/clock.vue'
import MceEditor from './components/mce-editor.vue'
import SheetHeaderBasic from './sheet-header-basic.vue'
import ProgressTrack from './components/progress/progress-track.vue'
import CollapseTransition from './components/transition/collapse-transition.vue'

const props = defineProps<{ item: any }>()
const $item = inject($ItemKey)

provide(
  ItemKey,
  computed(() => props.item)
)

const rankText = computed(() =>
  game.i18n.localize(RANKS[props.item.system.rank])
)

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
  $item?.update({ data: { subtype: props.item.system.subtype } })
}

function clockMaxChange() {
  $item?.update({ data: { clockMax: parseInt(props.item.system.clockMax) } })
}

function saveChecks() {
  $item?.update({
    data: {
      completed: props.item.system.completed,
      hasTrack: props.item.system.hasTrack,
      hasClock: props.item.system.hasClock,
    },
  })
}

function setClock(num) {
  $item?.update({ data: { clockTicks: num } })
}

function saveDescription() {
  $item?.update({ data: { description: props.item.system.description } })
}

function destroy() {
  Dialog.confirm({
    title: game.i18n.localize('IRONSWORN.DeleteAsset'),
    content: `<p><strong>${game.i18n.localize(
      'IRONSWORN.ConfirmDelete'
    )}</strong></p>`,
    yes: () => $item?.delete(),
    defaultYes: false,
  })
}
</script>
