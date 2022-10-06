<template>
  <AttrSlider
    class="momentum-meter-slider"
    attr="momentum"
    documentType="Actor"
    :labelPosition="labelPosition"
    :sliderStyle="props.sliderStyle"
    :initial-value="actor?.data.momentum ?? 2"
    :min="-6"
    :max="10"
    :softMax="actor?.data.momentumMax"
    :segmentClass="{
      [actor.data.momentumReset]: 'segment-momentum-reset',
    }"
  >
    <template #label>
      <BtnMomentumburn
        class="text"
        :class="{ vertical: sliderStyle === 'vertical' }"
        :tooltip="
          $t('IRONSWORN.BurnMomentumAndResetTo', {
            value: actor?.data.momentum,
            resetValue: actor?.data.momentumReset,
          })
        "
      >
        {{ $t('IRONSWORN.Momentum') }}
      </BtnMomentumburn>
    </template>
    <template #default>
      <section class="momentum-status flexcol">
        <span class="momentum-status-reset">
          {{ $t('IRONSWORN.Reset') }}: {{ actor?.data.momentumReset }}
        </span>
        <span class="momentum-status-max">
          {{ $t('IRONSWORN.Max') }}:
          {{ actor?.data.momentumMax }}
        </span>
      </section>
    </template>
  </AttrSlider>
</template>

<style lang="less">
.momentum-meter-slider {
  .momentum-status {
    grid-row: 3;
    grid-column: 1;
  }
  .attr-slider-label:hover ~ .slider-bar {
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
import { inject, Ref } from 'vue'
import { IronswornActor } from '../../../actor/actor.js'
import { CharacterDataProperties } from '../../../actor/actortypes.js'
import { ActorKey } from '../../provisions.js'
import BtnMomentumburn from '../buttons/btn-momentumburn.vue'

import AttrSlider from './attr-slider.vue'

const props = withDefaults(
  defineProps<{
    sliderStyle?: 'horizontal' | 'vertical'
    labelPosition?: 'right' | 'left'
  }>(),
  { sliderStyle: 'vertical', labelPosition: 'left' }
)

const actor = inject(ActorKey) as Ref<
  ReturnType<typeof IronswornActor.prototype.toObject> & CharacterDataProperties
>

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
