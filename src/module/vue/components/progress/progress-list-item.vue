<template>
  <article class="progress-list-item flexrow item-row">
    <h4 class="progress-title">{{ item.name }}</h4>
    <h5 class="progress-subtitle vertical-text">{{ subtitle }}</h5>
    <section class="progress-widgets flexrow">
      <ProgressTrack
        v-if="item.system.hasTrack"
        class="progress-track"
        :rank="item.system.rank"
        :ticks="item.system.current"
        :compact-progress="compactProgress"
      />
      <Clock
        v-if="item.system.hasClock"
        class="progress-clock nogrow"
        size="50px"
        :wedges="item.system.clockMax"
        :ticked="item.system.clockTicks"
        @click="setClock"
      />
    </section>
    <DocumentImg class="progress-img" :document="item" size="40px" />
    <RankPips
      class="progress-rank-pips nogrow"
      :current="item.system.rank"
      @click="rankClick"
    />
    <section class="progress-controls" data-tooltip-direction="UP">
      <IronBtn
        v-if="editMode"
        block
        icon="fa:trash"
        @click="destroy"
        :tooltip="$t('IRONSWORN.DeleteItem')"
      />
      <IronBtn
        block
        icon="fa:pen-to-square"
        @click="edit"
        :tooltip="$t('IRONSWORN.Edit')"
      />
      <IronBtn
        block
        v-if="editMode"
        :icon="completedIcon"
        @click="toggleComplete"
        :tooltip="completedTooltip"
      />
      <IronBtn
        block
        v-if="editMode && item.system.hasTrack"
        icon="fa:caret-left"
        @click="retreat"
        :tooltip="$t('IRONSWORN.UnmarkProgress')"
      />
      <IronBtn
        block
        v-if="item.system.hasTrack"
        icon="fa:caret-right"
        @click="advance"
        :tooltip="$t('IRONSWORN.MarkProgress')"
      />
      <BtnRollprogress
        v-if="item.system.hasTrack"
        :item="item"
        :tooltip="$t('IRONSWORN.ProgressRoll')"
        block
      />
      <IronBtn
        v-if="showStar"
        class="star-progress"
        block
        :tooltip="$t('IRONSWORN.StarProgress')"
        data-tooltip-direction="RIGHT"
        @click="toggleStar"
      >
        <template #icon>
          <Transition name="fade">
            <FontIcon
              name="star"
              :family="
                item.system.starred
                  ? FontAwesome.Family.Solid
                  : FontAwesome.Family.Regular
              "
            />
          </Transition>
        </template>
      </IronBtn>
    </section>
  </article>
</template>

<style lang="scss" scoped>
$progress-widget-spacing: 6px;

.progress-list-item {
  display: grid;
  grid-template-rows: max-content max-content 1fr;
  grid-template-columns: max-content max-content 1fr max-content;
  gap: $progress-widget-spacing;
  padding: calc($progress-widget-spacing / 2) calc($progress-widget-spacing / 2)
    $progress-widget-spacing;

  .progress-img {
    grid-row: 1 / span 2;
    grid-column: 2;
    margin: 0;
  }

  .progress-rank-pips {
    grid-row: 1;
    grid-column: 3 / span 2;
  }

  .progress-title {
    grid-row: 2;
    grid-column: 3;
    margin: 0;
    height: max-content;
    line-height: 1;
  }

  .progress-subtitle {
    grid-row: 1 / span 3;
    grid-column: 1;
    margin: 0;
    padding: 0;
    width: max-content;
    text-transform: uppercase;
    line-height: 1;
    color: var(--ironsworn-color-fg-muted);
    font-weight: normal;
  }

  .progress-widgets {
    grid-row: 3;
    grid-column: 2 / span 3;
    gap: 2px;

    .progress-clock {
      flex-basis: 50px;
    }
  }

  .progress-controls {
    display: grid;
    grid-row: 1 / span 2;
    grid-column: 4;
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
import IronBtn from '../buttons/iron-btn.vue'
import RankPips from '../rank-pips/rank-pips.vue'
import DocumentImg from '../document-img.vue'
import { RANKS } from '../../../constants.js'
import ProgressTrack from './progress-track.vue'
import FontIcon from '../icon/font-icon.vue'
import { FontAwesome } from '../icon/icon-common'

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
const subtitle = computed(() => {
  let subtype = capitalize(props.item.system.subtype)
  if (subtype === 'Bond') subtype = 'Connection' // translate name
  return game.i18n.localize(`IRONSWORN.${subtype}`)
})
const completedIcon = computed(() => {
  return props.item.system.completed ? 'fa:circle-check' : 'fa:circle-notch'
})
const completedTooltip = computed(() => {
  const suffix = props.item.system.completed ? 'Completed' : 'NotCompleted'
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
  foundryItem?.update({ system: { rank } })
}
function advance() {
  foundryItem?.markProgress(1)
}
function retreat() {
  foundryItem?.markProgress(-1)
}

const $emit = defineEmits(['completed'])

function toggleComplete() {
  const completed = !props.item.system.completed
  if (completed) $emit('completed')
  foundryItem?.update({ system: { completed } })
}
function toggleStar() {
  foundryItem?.update({
    system: { starred: !props.item.system.starred },
  })
}
function setClock(clockTicks: number) {
  foundryItem?.update({ system: { clockTicks } })
}
</script>
