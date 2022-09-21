<template>
  <article class="progress-embed">
    <RankPips
      class="progress-rank-pips"
      :for="`label-rank`"
      :current="item.data.rank"
      @click="setRank"
    />
    <h4 class="label-rank" id="label-rank">{{ rankText }}</h4>
    <section class="progress-controls flexrow">
      <BtnFaicon class="block nogrow" icon="trash" @click="clearProgress" />
      <BtnFaicon
        class="block nogrow"
        icon="caret-right"
        @click="markProgress"
      />
    </section>
    <Track class="progress-track" :ticks="item.data.current" />
  </article>
</template>

<style lang="less" scoped>
.progress-embed {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: max-content max-content 1fr;
  gap: 6px;
  align-items: end;
  .label-rank {
    margin: 0;
    grid-row: 1;
    line-height: 1;
  }
  .progress-rank-pips {
    grid-row: 1;
  }
  .progress-controls {
    grid-column: 3;
    justify-content: end;
  }
  .progress-track {
    grid-row: 2;
    grid-column: 1 / span 3;
  }
}
</style>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { RANKS, RANK_INCREMENTS } from '../../../constants.js'
import { $ActorKey, $ItemKey } from '../../provisions.js'
import Track from './track.vue'
import BtnFaicon from '../buttons/btn-faicon.vue'
import RankPips from '../rank-pips/rank-pips.vue'

const props = defineProps<{
  item: any
}>()

const $item = inject($ItemKey)
const $actor = inject($ActorKey)

const rankText = computed(() => {
  return game.i18n.localize(RANKS[props.item.data.rank])
})

function setRank(rank) {
  $item?.update({ data: { rank } })
}

function clearProgress() {
  $item?.update({ 'data.current': 0 })
}
function markProgress() {
  console.log($actor)
  const increment = RANK_INCREMENTS[props.item.data.rank]
  const newValue = Math.min(props.item.data.current + increment, 40)
  $item?.update({ 'data.current': newValue })
}
</script>
