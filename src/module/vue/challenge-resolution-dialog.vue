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

    <section
      class="dice-result dice-tooltip dice-roll ironsworn-roll"
      v-html="state.renderedGraphic"
    ></section>

    <div
      class="boxgroup"
      style="margin-top: 1rem"
      :data-tooltip="
        saveDisabled ? $t('IRONSWORN.ResolveChallengeDisabled') : undefined
      "
    >
      <div class="boxrow flexrow">
        <button
          type="button"
          class="clickable block save"
          :class="{ disabled: saveDisabled }"
          @click="save"
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
import { computed, inject, reactive } from 'vue'
import { IronswornRollMessage } from '../rolls'
import { renderRollGraphic } from '../rolls/roll-graphic'

const props = defineProps<{ messageId: string }>()
const irm = await IronswornRollMessage.fromMessage(props.messageId)

type AOrB = 'a' | '' | 'b'
const state = reactive({
  rows:
    irm?.roll.rawChallengeDiceValues?.map((d) => ({
      dieValue: d,
      choice: '' as AOrB,
    })) ?? [],
  renderedGraphic: undefined as string | undefined,
})

function update(i: number, value: AOrB) {
  // Clear others of this choice
  for (const row of state.rows) {
    if (row.choice === value) row.choice = ''
  }

  // Set this choice
  state.rows[i].choice = value

  updateRollGraphic()
}

function selectedDiceValues(): [number | undefined, number | undefined] {
  return [
    state.rows.find((x) => x.choice === 'a')?.dieValue,
    state.rows.find((x) => x.choice === 'b')?.dieValue,
  ]
}

async function updateRollGraphic() {
  if (!irm) return
  const roll = irm.roll.clone()

  // Get the choices
  const [die1, die2] = selectedDiceValues()
  if (die1) {
    roll.postRollOptions.replacedChallenge1 = {
      source: 'manual',
      value: die1,
    }
  }
  if (die2) {
    roll.postRollOptions.replacedChallenge2 = {
      source: 'manual',
      value: die2,
    }
  }

  // Render the graphic
  state.renderedGraphic = await renderRollGraphic({ roll })
}
updateRollGraphic()

const saveDisabled = computed(() => {
  const hasA = !!state.rows.find((x) => x.choice === 'a')
  const hasB = !!state.rows.find((x) => x.choice === 'b')
  return !(hasA && hasB)
})

function save() {
  if (!irm) return
  const [die1, die2] = selectedDiceValues()
  if (die1 === undefined || die2 === undefined) return

  irm.roll.postRollOptions.replacedChallenge1 = {
    source: 'manual',
    value: die1,
  }
  irm.roll.postRollOptions.replacedChallenge2 = {
    source: 'manual',
    value: die2,
  }

  irm.createOrUpdate()
  CONFIG.IRONSWORN.emitter.emit('closeApp')
}
</script>
