<template>
  <div class="flexrow item-row">
    <h5 class="vertical nogrow">{{ subtitle }}</h5>
    <div class="flexcol">
      <div class="flexrow">
        <document-img
          :document="item"
          size="38px"
          class="nogrow"
          style="margin-right: 5px"
        />
        <div class="flexcol">
          <div class="flexrow">
            <RankPips :current="item.data.rank" @click="rankClick" />
            <btn-faicon
              class="block nogrow"
              v-if="editMode"
              icon="trash"
              @click="destroy"
              :tooltip="$t('IRONSWORN.DeleteItem')"
            />
            <btn-faicon
              class="block nogrow"
              icon="edit"
              @click="edit"
              :tooltip="$t('IRONSWORN.Edit')"
            />
            <btn-faicon
              class="block nogrow"
              v-if="editMode"
              :icon="completedIcon"
              @click="toggleComplete"
              :tooltip="completedTooltip"
            />
            <btn-faicon
              class="block nogrow"
              v-if="editMode && item.data.hasTrack"
              icon="caret-left"
              @click="retreat"
              :tooltip="$t('IRONSWORN.UnmarkProgress')"
            />
            <btn-faicon
              class="block nogrow"
              v-if="item.data.hasTrack"
              icon="caret-right"
              @click="advance"
              :tooltip="$t('IRONSWORN.MarkProgress')"
            />
            <btn-rollprogress
              v-if="item.data.hasTrack"
              :item="item"
              :tooltip="$t('IRONSWORN.ProgressRoll')"
              class="flexrow nogrow block"
            />
          </div>
          <h4 class="flexrow">
            <span>{{ item.name }}</span>
            <btn-faicon
              class="block nogrow"
              icon="star"
              :solid="item.data.starred"
              :tooltip="$t('IRONSWORN.StarProgress')"
              @click="toggleStar"
              v-if="showStar"
            />
          </h4>
        </div>
      </div>
      <div class="flexrow" style="justify-content: center">
        <progress-track :ticks="item.data.current" v-if="item.data.hasTrack" />
        <clock
          v-if="item.data.hasClock"
          class="nogrow"
          style="flex-basis: 50px; margin: 0 0.5rem"
          size="50px"
          :wedges="item.data.clockMax"
          :ticked="item.data.clockTicks"
          @click="setClock"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
div.item-row {
  padding-left: 0;
}
h5.vertical {
  padding-right: 2px;
  margin: 0;
  font-weight: normal;
}
</style>

<script lang="ts" setup>
import { capitalize, computed, inject, provide, Ref } from 'vue'
import { $ActorKey, $ItemKey } from '../../provisions'
import Clock from '../clock.vue'
import ProgressTrack from './progress-track.vue'
import BtnRollprogress from '../buttons/btn-rollprogress.vue'
import BtnFaicon from '../buttons/btn-faicon.vue'
import RankPips from '../rank-pips/rank-pips.vue'
import DocumentImg from '../document-img.vue'

const props = defineProps<{
  item: any
  showStar?: boolean
}>()

const actor = inject('actor') as Ref
const $actor = inject($ActorKey)

const $item = $actor?.items.get(props.item._id)
provide($ItemKey, $item)

const editMode = computed(() => {
  return actor.value.flags['foundry-ironsworn']?.['edit-mode']
})
const showTrackButtons = computed(() => {
  return props.item.data.hasTrack
})
const foundryItem = computed(() => {
  return $actor?.items.get(props.item._id)
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
  $item?.sheet?.render(true)
}
function destroy() {
  const titleKey = `IRONSWORN.Delete${capitalize($item?.type || '')}`

  Dialog.confirm({
    title: game.i18n.localize(titleKey),
    content: `<p><strong>${game.i18n.localize(
      'IRONSWORN.ConfirmDelete'
    )}</strong></p>`,
    yes: () => $item?.delete(),
    defaultYes: false,
  })
}
function rankClick(rank) {
  $item?.update({ data: { rank } })
}
function advance() {
  $item?.markProgress(1)
}
function retreat() {
  $item?.markProgress(-1)
}

const $emit = defineEmits(['completed'])
function toggleComplete() {
  const completed = !props.item.data.completed
  if (completed) $emit('completed')
  $item?.update({ data: { completed } })
}
function toggleStar() {
  $item?.update({ data: { starred: !props.item.data.starred } })
}
function setClock(num) {
  $item?.update({ data: { clockTicks: num } })
}
</script>
