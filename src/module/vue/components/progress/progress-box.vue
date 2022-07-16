<template>
  <div class="flexrow item-row">
    <h5 class="vertical-v2 nogrow">{{ subtitle }}</h5>
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
            <rank-hexes :current="item.data.rank" @click="rankClick" />
            <btn-faicon
              class="block"
              v-if="editMode"
              icon="trash"
              @click="destroy"
              :tooltip="$t('IRONSWORN.DeleteItem')"
            />
            <btn-faicon
              class="block"
              icon="edit"
              @click="edit"
              :tooltip="$t('IRONSWORN.Edit')"
            />
            <btn-faicon
              class="block"
              v-if="editMode"
              :icon="completedIcon"
              @click="toggleComplete"
              :tooltip="completedTooltip"
            />
            <btn-faicon
              class="block"
              v-if="editMode && item.data.hasTrack"
              icon="caret-left"
              @click="retreat"
              :tooltip="$t('IRONSWORN.UnmarkProgress')"
            />
            <btn-faicon
              class="block"
              v-if="item.data.hasTrack"
              icon="caret-right"
              @click="advance"
              :tooltip="$t('IRONSWORN.MarkProgress')"
            />
            <btn-rollprogress
              v-if="item.data.hasTrack"
              :tooltip="$t('IRONSWORN.ProgressRoll')"
              class="flexrow nogrow block"
            />
          </div>
          <h4 class="flexrow">
            <span>{{ item.name }}</span>
            <btn-faicon
              class="block"
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
          :size="50"
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
h5.vertical-v2 {
  padding-right: 2px;
  margin: 0;
  font-weight: normal;
}
</style>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { IronswornActor } from '../../../actor/actor'

const props = defineProps<{
  item: any
  showStar?: boolean
}>()

const actor = inject('actor')
const $actor = inject('$actor') as IronswornActor
const $item = () => $actor?.items.get(props.item._id)

const editMode = computed(() => {
  return actor.flags['foundry-ironsworn']?.['edit-mode']
})
const showTrackButtons = computed(() => {
  return props.item.data.hasTrack
})
const foundryItem = computed(() => {
  return $actor?.items.get(props.item._id)
})
const subtitle = computed(() => {
  let subtype = this.$capitalize(props.item.data.subtype)
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
  $item()?.sheet.render(true)
}
function destroy() {
  const item = $item()
  const titleKey = `IRONSWORN.Delete${this.$capitalize(item?.type || '')}`

  Dialog.confirm({
    title: game.i18n.localize(titleKey),
    content: `<p><strong>${game.i18n.localize(
      'IRONSWORN.ConfirmDelete'
    )}</strong></p>`,
    yes: () => item?.delete(),
    defaultYes: false,
  })
}
function rankClick(rank) {
  $item()?.update({ data: { rank } })
}
function advance() {
  $item()?.markProgress(1)
}
function retreat() {
  $item()?.markProgress(-1)
}
function toggleComplete() {
  const completed = !this.item.data.completed
  if (completed) this.$emit('completed')
  $item()?.update({ data: { completed } })
}
function toggleStar() {
  $item()?.update({ data: { starred: !this.item.data.starred } })
}
function setClock(num) {
  $item()?.update({ data: { clockTicks: num } })
}
</script>
