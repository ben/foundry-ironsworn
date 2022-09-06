<template>
  <form class="challenge-resolution-dialog flexcol" style="flex-grow: 1">
    <div class="grid">
      <div class="flexrow" v-for="(row, i) in state.rows" :key="`row${i}`">
        <input
          type="radio"
          class="a"
          :checked="row.choice === 'a'"
          @change="update(i, 'a')"
        />
        <div class="ironsworn-roll roll-graphic dice-formula">
          <span
            class="roll die isiconbg-d10-blank d10 challenge challenge-die {{minmax}}"
          >
            {{ row.dieValue }}
          </span>
        </div>
        <input
          type="radio"
          class="b"
          :checked="row.choice === 'b'"
          @change="update(i, 'b')"
        />
      </div>
    </div>
    <div
      class="boxgroup"
      style="margin-top: 1rem"
      :data-tooltip="saveDisabled ? 'Make valid choices' : undefined"
    >
      <div class="boxrow flexrow">
        <button
          class="clickable block save"
          :class="{ disabled: saveDisabled }"
        >
          <i class="fas fa-check"></i>
          {{ $t('Save') }}
        </button>
      </div>
    </div>
  </form>
</template>

<style lang="less" scoped>
div.grid {
  margin: 1em;
  justify-items: center;
  flex-grow: 1;
}

input {
  margin: 7px;
  width: 30px;

  &.a {
    grid-column: 1;
    justify-self: end;
  }

  &.b {
    grid-column: 3;
    justify-self: start;
  }
}
</style>

<script setup lang="ts">
import { isArrayLikeObject } from 'lodash'
import { computed, reactive } from 'vue'
import { IronswornRollMessage } from '../rolls'

const props = defineProps<{ messageId: string }>()
const irm = await IronswornRollMessage.fromMessage(props.messageId)

type AOrB = 'a' | '' | 'b'
const state = reactive({
  rows:
    irm?.roll.rawChallengeDiceValues?.map((d) => ({
      dieValue: d,
      choice: '' as AOrB,
    })) ?? [],
})

function update(i: number, value: AOrB) {
  // Clear others of this choice
  for (const row of state.rows) {
    if (row.choice === value) row.choice = ''
  }

  // Set this choice
  state.rows[i].choice = value
}

const saveDisabled = computed(() => {
  const hasA = !!state.rows.find((x) => x.choice === 'a')
  const hasB = !!state.rows.find((x) => x.choice === 'b')
  return !(hasA && hasB)
})
</script>
