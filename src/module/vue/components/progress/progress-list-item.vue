<template>
  <article class="progress-list-item flexrow item-row">
    <h4 class="progress-title">{{ item.name }}</h4>
    <h5 class="progress-subtitle vertical">{{ subtitle }}</h5>
    <section class="progress-widgets flexrow">
      <ProgressTrack
        v-if="item.data.hasTrack"
        class="progress-track"
        :rank="item.data.rank"
        :ticks="item.data.current"
        :compact-progress="compactProgress"
      />
      <Clock
        v-if="item.data.hasClock"
        class="progress-clock nogrow"
        size="50px"
        :wedges="item.data.clockMax"
        :ticked="item.data.clockTicks"
        @click="setClock"
      />
    </section>
    <DocumentImg class="progress-img" :document="item" size="40px" />
    <RankPips
      class="progress-rank-pips"
      :current="item.data.rank"
      @click="rankClick"
    />
    <section
      v-if="showTrackButtons"
      class="progress-controls"
      data-tooltip-direction="UP"
    >
      <BtnFaicon
        class="block"
        v-if="editMode"
        icon="trash"
        @click="destroy"
        :tooltip="$t('IRONSWORN.DeleteItem')"
      />
      <BtnFaicon
        class="block"
        icon="edit"
        @click="edit"
        :tooltip="$t('IRONSWORN.Edit')"
      />
      <BtnFaicon
        class="block"
        v-if="editMode"
        :icon="completedIcon"
        @click="toggleComplete"
        :tooltip="completedTooltip"
      />
      <BtnFaicon
        class="block"
        v-if="editMode && item.data.hasTrack"
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
      <BtnRollprogress
        v-if="item.data.hasTrack"
        :item="item"
        :tooltip="$t('IRONSWORN.ProgressRoll')"
        class="block"
      />
      <BtnFaicon
        v-if="showStar"
        class="star-progress block"
        icon="star"
        :solid="item.data.starred"
        :tooltip="$t('IRONSWORN.StarProgress')"
        data-tooltip-direction="RIGHT"
        @click="toggleStar"
      />
    </section>
  </article>
</template>

<style lang="less" scoped>
@progress_widget_spacing: 6px;
.progress-list-item {
  padding: (@progress_widget_spacing / 2) (@progress_widget_spacing / 2)
    @progress_widget_spacing;
  display: grid;
  grid-template-columns: max-content max-content 1fr max-content;
  grid-template-rows: max-content max-content 1fr;
  gap: @progress_widget_spacing;
  .progress-img {
    grid-column: 2;
    grid-row: 1 / span 2;
    margin: 0;
  }
  .progress-rank-pips {
    grid-column: 3 / span 2;
    grid-row: 1;
  }
  .progress-title {
    grid-column: 3;
    grid-row: 2;
    margin: 0;
    line-height: 1;
    height: max-content;
  }
  .progress-subtitle {
    grid-column: 1;
    grid-row: 1 / span 3;
    padding: 0;
    line-height: 1;
    width: max-content;
    padding: 0;
    margin: 0;
    font-weight: normal;
  }
  .progress-widgets {
    grid-column: 2 / span 3;
    grid-row: 3;
    gap: 2px;
    .progress-clock {
      flex-basis: 50px;
    }
  }
  .progress-controls {
    display: grid;
    grid-column: 4;
    grid-row: 1 / span 2;
    grid-auto-flow: column;
    > * {
      aspect-ratio: 1;
      grid-row: 1;
    }
    .star-progress {
      grid-row: 2;
    }
  }
}
</style>

<script lang="ts" setup>
import { capitalize, computed, inject, provide, Ref } from 'vue'
import { $ActorKey, $ItemKey, ActorKey, ItemKey } from '../../provisions'
import Clock from '../clock.vue'
import BtnRollprogress from '../buttons/btn-rollprogress.vue'
import BtnFaicon from '../buttons/btn-faicon.vue'
import RankPips from '../rank-pips/rank-pips.vue'
import DocumentImg from '../document-img.vue'
import { RANKS } from '../../../constants.js'
import ProgressTrack from './progress-track.vue'

const props = defineProps<{
  item: any
  showStar?: boolean
  /**
   * When true, renders the progress bar for more compact display.
   */
  compactProgress?: boolean
}>()

const actor = inject(ActorKey)
const $actor = inject($ActorKey)

const foundryItem = $actor?.items.get(props.item.id ?? props.item._id)

provide(ItemKey, computed(() => foundryItem?.toObject()) as any)
provide($ItemKey, foundryItem)

const editMode = computed(() => {
  return (actor?.value.flags as any)['foundry-ironsworn']?.['edit-mode']
})
const showTrackButtons = computed(() => {
  return props.item.data.hasTrack
})
const subtitle = computed(() => {
  let subtype = capitalize(props.item.data.subtype)
  if (subtype === 'Bond') subtype = 'Connection' // translate name
  return game.i18n.localize(`IRONSWORN.${subtype}`)
})
const completedIcon = computed(() => {
  return props.item.data.completed ? 'check-circle' : 'circle-notch'
})
const completedTooltip = computed(() => {
  const suffix = props.item.data.completed ? 'Completed' : 'NotCompleted'
  return game.i18n.localize('IRONSWORN.' + suffix)
})

function edit() {
  foundryItem?.sheet?.render(true)
}
function destroy() {
  const titleKey = `IRONSWORN.Delete${capitalize(foundryItem?.type || '')}`

  Dialog.confirm({
    title: game.i18n.localize(titleKey),
    content: `<p><strong>${game.i18n.localize(
      'IRONSWORN.ConfirmDelete'
    )}</strong></p>`,
    yes: () => foundryItem?.delete(),
    defaultYes: false,
  })
}
function rankClick(rank: keyof typeof RANKS) {
  foundryItem?.update({ data: { rank } })
}
function advance() {
  foundryItem?.markProgress(1)
}
function retreat() {
  foundryItem?.markProgress(-1)
}

const $emit = defineEmits(['completed'])

function toggleComplete() {
  const completed = !props.item.data.completed
  if (completed) $emit('completed')
  foundryItem?.update({ data: { completed } })
}
function toggleStar() {
  foundryItem?.update({
    data: { starred: !props.item.data.starred },
  })
}
function setClock(clockTicks: number) {
  foundryItem?.update({ data: { clockTicks } })
}
</script>
