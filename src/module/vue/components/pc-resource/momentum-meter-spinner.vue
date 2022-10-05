<template>
  <AttrSpinner
    class="momentum-meter-spinner"
    attr="momentum"
    documentType="Actor"
    :spinnerStyle="props.spinnerStyle"
    :initial-value="actor?.data.momentum"
    :min="-6"
    :max="10"
    :softMax="actor?.data.momentumMax"
    :segmentClass="{
      [actor?.data.momentumReset]: 'segment-momentum-reset',
    }"
  >
    <template #label>
      <BtnMomentumBurn
        class="text"
        :class="{ 'vertical-v2': spinnerStyle === 'vertical' }"
        :tooltip="
          $t('IRONSWORN.BurnMomentumAndResetToX', {
            value: actor?.data.momentumReset,
          })
        "
      >
        {{ $t('IRONSWORN.Momentum') }}
      </BtnMomentumBurn>
    </template>
    <template #default>
      <!-- <hr class="nogrow" /> -->
      <!-- replace HR above with line divider -->
      <section class="momentum-status flexcol">
        <span>
          {{ $t('IRONSWORN.Reset') }}: {{ actor?.data.momentumReset }}
        </span>
        <span>
          {{ $t('IRONSWORN.Max') }}:
          {{ actor?.data.momentumMax }}
        </span>
      </section>
    </template>
  </AttrSpinner>
</template>

<style lang="less">
.momentum-meter-spinner {
  .momentum-status {
    grid-row: 3;
    grid-column: 1;
  }
  .attr-spinner-label:hover ~ .spinner-bar {
    .segment-momentum-reset {
      border: 1px solid var(--color-border-highlight-alt);
      border-bottom: 1px solid var(--color-border-highlight);
      box-shadow: 0 0 10px var(--color-shadow-highlight);

      // color: var(--color-text-light-highlight);
      // background: #00000055;
      z-index: 10;
    }
  }
}
</style>

<script lang="ts" setup>
import { computed, Ref } from '@vue/reactivity'
import { inject } from 'vue'
import { $ActorKey } from '../../provisions.js'
import BtnMomentumBurn from '../buttons/btn-momentum-burn.vue'
import AttrSpinner from './attr-spinner.vue'

const props = withDefaults(
  defineProps<{
    spinnerStyle: 'horizontal' | 'vertical'
  }>(),
  { spinnerStyle: 'vertical' }
)

const actor = inject('actor') as Ref
const $actor = inject($ActorKey)

// const tooltip = `<dl>
// <dt><kbd>Enter</kbd></dt>
// <dd>Burn your momentum and reset it to ${props.min}.</dd>
// <dt><kbd>UpArrow</kbd></dt>
// <dt><kbd>+</kbd></dt>
// <dd>Increase by 1.</dd>
// <dt><kbd>DownArrow</kbd></dt>
// <dt><kbd>-</kbd></dt>
// <dd>Decrease by 1.</dd>
// <dt><kbd>Home</kbd></dt>
// <dd>Set to maximum (${currentMax.value}).</dd>
// <dt><kbd>End</kbd></dt>
// <dd>Set to minimum (${props.min}).</dd>
// <dt><kbd>0-9</kbd></dt>
// <dd>Set to a specific value.</dd>
// </dl>
// `
</script>
